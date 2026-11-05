from pathlib import Path
import hashlib
import json
import shutil
import zipfile


project = Path(__file__).resolve().parents[1]
source = project / 'dist' / 'client'
output = project.parent / '发布包' / '2026-11-05'
site = output / 'ORILUX-AI-Netlify'
archive = output / 'ORILUX-AI-Netlify.zip'
required = [
    'index.html', 'v2/index.html', 'community/index.html',
    'community/article/index.html', 'account/index.html', 'join/index.html',
]

for name in required:
    if not (source / name).is_file():
        raise RuntimeError(f'Missing page: {name}')

if site.exists() or archive.exists():
    raise RuntimeError('Netlify package already exists; inspect it before replacing.')

files = sorted(path for path in source.rglob('*') if path.is_file())
for path in files:
    if path.is_symlink() or not path.resolve().is_relative_to(source.resolve()):
        raise RuntimeError(f'Unexpected path: {path}')
    relative = path.relative_to(source)
    if any(part in {'.git', 'node_modules', 'server', 'worker', '.wrangler'} for part in relative.parts):
        raise RuntimeError(f'Unexpected internal directory: {relative}')
    if path.name.startswith(('.env', '.dev.vars')):
        raise RuntimeError(f'Unexpected environment file: {relative}')

output.mkdir(parents=True, exist_ok=True)
shutil.copytree(source, site)
(site / '_headers').write_text('''/assets/*
  Cache-Control: public, max-age=31536000, immutable
''', encoding='utf-8')

instructions = '''# ORILUX AI · Netlify 上传说明

目标项目：https://app.netlify.com/projects/papaya-dango-a9b54e/overview

## 上传方法

1. 解压 `ORILUX-AI-Netlify.zip` 到一个文件夹。若使用本机已有的 `ORILUX-AI-Netlify` 文件夹，可直接执行下一步。
2. 打开上方已有项目，在 `Deploys` 页面找到手动部署 / 拖放上传区域。
3. 拖入解压后的整个文件夹。该文件夹内应直接看到 `index.html`、`assets`、`community`、`join`、`media` 等内容，不要选择外层的“发布包”文件夹。
4. 等待 Netlify 完成部署，再打开项目域名查看。

这是已构建好的静态成品；手动上传无需填写构建命令，无需运行 npm install，也不要上传源码包或 Cloudflare Worker 发布包。

官方操作说明：https://docs.netlify.com/deploy/create-deploys/#drag-and-drop

## 页面与资源

- 首页：`/`
- 2.0 兼容入口：`/v2/`
- 社区：`/community/`
- 文章示例：`/community/article/?id=yaojing-culture-wall`
- 社区伙伴：`/join/`
- 个人中心兼容入口：`/account/`（导航入口仍隐藏）

完整包含图片、视频、成员海报和前端交互资源。每个页面都有独立的 index.html，因此无需添加 `/* /index.html 200` 之类的 SPA 回退。静态资源使用站点根路径，请部署在域名根目录。

## 服务范围

此包仅部署前端页面。当前文章评论和个人中心入口仍按原要求隐藏。原评论服务依赖 Cloudflare Worker 与 D1，不能随静态文件自动部署到 Netlify；若直接访问个人中心，其“我的评论”无法加载服务端数据，资料、草稿与收藏仍保存在当前浏览器。

本次只生成上传包，没有替换任何线上部署。
'''
(output / 'Netlify-部署说明.md').write_text(instructions, encoding='utf-8')

packaged_files = sorted(path for path in site.rglob('*') if path.is_file())
manifest = []
with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
    for path in packaged_files:
        data = path.read_bytes()
        name = path.relative_to(site).as_posix()
        manifest.append({'path': name, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest()})
        bundle.writestr(name, data)

with zipfile.ZipFile(archive) as bundle:
    if bundle.testzip() is not None:
        raise RuntimeError('Archive CRC check failed')
    names = set(bundle.namelist())
    if not set(required).issubset(names) or len(names) != len(packaged_files):
        raise RuntimeError('Archive page or file count check failed')
    for item in manifest:
        if hashlib.sha256(bundle.read(item['path'])).hexdigest() != item['sha256']:
            raise RuntimeError(f"Archive hash mismatch: {item['path']}")

digest = hashlib.sha256(archive.read_bytes()).hexdigest()
(output / 'Netlify-SHA256SUMS.txt').write_text(f'{digest}  {archive.name}\n', encoding='utf-8')
(output / 'Netlify-文件清单.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({
    'archive': str(archive),
    'folder': str(site),
    'files': len(packaged_files),
    'archive_bytes': archive.stat().st_size,
    'sha256': digest,
    'verified': 'All six page entries, CRC, and every file SHA256',
}, ensure_ascii=False, indent=2))
