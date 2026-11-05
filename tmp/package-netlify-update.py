from pathlib import Path
import hashlib
import json
import shutil
import zipfile

project = Path(__file__).resolve().parents[1]
source = project / 'dist' / 'client'
release = project.parent / '发布包' / '2026-11-05-更新版'
stage = release / 'ORILUX-AI-Netlify'
archive = release / 'ORILUX-AI-Netlify-20261105-更新版.zip'
if stage.exists() or archive.exists():
    raise SystemExit('Release already exists; keep the previous package unchanged.')

entries = ['index.html', 'v2/index.html', 'community/index.html',
           'community/article/index.html', 'join/index.html', 'account/index.html']
for entry in entries:
    if not (source / entry).is_file():
        raise SystemExit(f'Missing page: {entry}')

shutil.copytree(source, stage)
(stage / '_headers').write_text('/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n', encoding='utf-8')
files = sorted(p for p in stage.rglob('*') if p.is_file())
manifest = []
for file in files:
    name = file.relative_to(stage).as_posix()
    if any(part in {'.git', 'node_modules', '.wrangler', '.openai', 'server'} for part in file.relative_to(stage).parts) or file.name.startswith(('.env', '.dev.vars')):
        raise SystemExit(f'Unexpected deployment file: {name}')
    manifest.append({'path': name, 'bytes': file.stat().st_size,
                     'sha256': hashlib.sha256(file.read_bytes()).hexdigest()})

with zipfile.ZipFile(archive, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as bundle:
    for item in manifest:
        bundle.write(stage / item['path'], item['path'])

with zipfile.ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    assert set(entries).issubset(bundle.namelist())
    assert set(bundle.namelist()) == {item['path'] for item in manifest}
    for item in manifest:
        assert hashlib.sha256(bundle.read(item['path'])).hexdigest() == item['sha256']
    script = '\n'.join(bundle.read(name).decode('utf-8') for name in bundle.namelist() if name.startswith('assets/') and name.endswith('.js'))
    assert '极简画廊' not in script
    assert '一个人可以开始' not in script
    assert '经典蓝白' in script and '暖白墨色' in script

archive_hash = hashlib.sha256(archive.read_bytes()).hexdigest()
(release / '文件清单.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(release / 'SHA256SUMS.txt').write_text(f'{archive_hash}  {archive.name}\n', encoding='utf-8')
(release / '部署说明.md').write_text('''# ORILUX AI · Netlify 更新版

本包为 2026-11-05 最新静态构建。已移除“极简画廊”样式，保留经典蓝白和暖白墨色；已隐藏“一个人可以开始，一群人可以走得更远”整块及三张卡片。

目标项目：https://app.netlify.com/projects/papaya-dango-a9b54e/overview

解压 ZIP 后，将直接包含 index.html、assets、community、join、media 等内容的文件夹上传到已有 Netlify 项目。也可使用本目录已有的 ORILUX-AI-Netlify 文件夹。无需上传源码或运行构建命令。

本包包含首页、社区、文章、加入我们、兼容入口和全部前端图片视频资源。页面均有独立入口，可部署于域名根目录。当前仅生成本地包，未发布到线上。

此包为前端静态部署。评论和个人中心入口仍隐藏；原评论接口依赖 Cloudflare Worker / D1，不包含在 Netlify 静态包内。直接访问个人中心时，服务端评论数据不可用，资料、草稿与收藏仍保存在当前浏览器。

文件清单和 SHA256SUMS.txt 用于校验，无需随网站上传。
''', encoding='utf-8')
print(json.dumps({'archive': str(archive), 'folder': str(stage), 'files': len(manifest),
                  'bytes': archive.stat().st_size, 'sha256': archive_hash,
                  'verified': True}, ensure_ascii=False))
