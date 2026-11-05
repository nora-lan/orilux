from pathlib import Path
import hashlib
import json
import re
import zipfile

project = Path(__file__).resolve().parents[1]
output = project.parent / '发布包' / '2026-11-05'
output.mkdir(parents=True, exist_ok=True)

instructions = '''# ORILUX AI 曜境官网 · 发布说明

打包日期：2026-11-05。此包已完成生产构建，包含当前全部页面、图片、视频和最新 AI 伙伴交互模块。

## 文件选择

- ORILUX-AI-发布包.zip：已构建成品，无需重新编译。
- ORILUX-AI-源码包.zip：React + TypeScript + Vite 完整源码、锁文件、构建脚本和数据库迁移。
- SHA256SUMS.txt：压缩包完整性校验值。

## 方案一：宝塔 / Nginx / 普通静态空间

1. 解压发布包。
2. 将 site 文件夹内的全部内容上传到网站根目录。网站根目录应直接看到 index.html、assets、media、community、join 等。
3. 设置默认首页为 index.html，通过 HTTP/HTTPS 访问域名。不要直接双击 HTML，也不要把网站放在额外的子路径内。
4. 确认 /community/、/join/、/community/article/?id=yaojing-culture-wall 可以直接访问。

Nginx 可使用以下路径规则（替换 root 为实际网站目录）：

```nginx
root /www/wwwroot/your-domain;
index index.html;
location / {
    try_files $uri $uri/ =404;
}
```

只上传 site/ 的内容；worker/、drizzle/、wrangler.json 和源码不需要放入公共网站目录。

这种方式可展示首页、社区文章、成员海报、轮播与本地 AI 交互。它不包含评论后端；当前评论入口和个人中心入口仍按原要求隐藏。若后续启用跨访客评论，请使用下面的完整部署方式。

## 方案二：Cloudflare Workers + D1 完整部署

解压发布包，在其根目录打开终端。使用 Node.js 22.12 或以上版本。

1. 登录你自己的 Cloudflare 账号：

```sh
npx --yes wrangler@4.92.0 login
```

2. 首次部署时创建数据库；若已有该站点的生产数据库，直接复用其 ID，不要新建替代：

```sh
npx --yes wrangler@4.92.0 d1 create orilux-community
```

3. 编辑包根目录的 wrangler.json，把 REPLACE_WITH_YOUR_D1_DATABASE_ID 替换为真实数据库 ID。若数据库名称不同，同步修改 database_name。DB 和 ASSETS 绑定名保持不变。

4. 在目标数据库应用两条迁移，然后发布：

```sh
npx --yes wrangler@4.92.0 d1 migrations apply DB --remote --config wrangler.json
npx --yes wrangler@4.92.0 deploy --config wrangler.json
```

5. 使用终端返回的地址访问。需要自己的域名时，在 Cloudflare 对应 Worker 的域名设置里绑定。

此配置已把 /api/* 交给 Worker，其余路径交给 site/ 静态资源；前端和评论 API 需要同源。
新数据库初始为空。压缩包不含本机或线上评论数据，不会迁移用户数据。

## 源码运行与重新构建

解压源码包，进入 orilux-ai-source/：

```sh
npm ci
npm run dev
```

构建完整服务并在本机预览：

```sh
npm run build
npm run db:migrate:local
npm run preview
```

完整预览地址为 http://127.0.0.1:5173/。npm run dev 仅启动前端开发服务。

重新构建后：把 dist/client 的内容放到发布包 site/，把 dist/server/index.js 放到 worker/index.js，并同步 drizzle/ 迁移文件。保留已配置真实数据库 ID 的发布包根 wrangler.json。
不要用源码构建生成的 dist/server/wrangler.json 替换生产配置：它使用本地数据库占位 ID。

源码中的 .openai/hosting.json 保留原 Sites 站点标识，构建脚本依赖它；它不是 Cloudflare 密钥。

## 当前功能边界

- AI 伙伴、代码/创作预览为前端预设场景演示，支持任务筛选、需求匹配、过程动画、成果预览与导出，未连接真实模型接口。
- “开始体验”在新标签页打开 https://opc.ydcq3.com/app/#login 。
- 收藏、个人草稿及偏好保存在访问者当前浏览器；咨询表单仅生成本地需求清单。
- 包内已包含媒体素材；保留了 public/media 下的来源说明。

## 已完成检查

- TypeScript、Vite 和 Worker 生产构建通过。
- 首页/社区/文章/个人中心路由与评论服务现有自动测试通过，包括输入校验、同源校验、访客隔离、幂等、限流与本人删除。
- AI 伙伴任务筛选、输入匹配、成果预览、桌面和 390px 手机布局已检查，未出现横向页面溢出，浏览器错误日志为空。
- 压缩包排除了 node_modules、Git、临时文件、日志、环境密钥和本地数据库。

本次只生成发布文件，没有上传或替换线上站点。
'''

config = {
    'name': 'orilux-ai',
    'main': 'worker/index.js',
    'compatibility_date': '2026-05-15',
    'assets': {'directory': 'site', 'binding': 'ASSETS', 'run_worker_first': ['/api/*']},
    'd1_databases': [{'binding': 'DB', 'database_name': 'orilux-community',
                      'database_id': 'REPLACE_WITH_YOUR_D1_DATABASE_ID', 'migrations_dir': 'drizzle'}],
}

def digest(data):
    return hashlib.sha256(data).hexdigest()

def write_archive(path, entries):
    manifest = []
    with zipfile.ZipFile(path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
        for name, data in sorted(entries.items()):
            archive.writestr(name, data)
            manifest.append({'path': name, 'bytes': len(data), 'sha256': digest(data)})
        archive.writestr('FILE-MANIFEST.json', json.dumps(manifest, ensure_ascii=False, indent=2))
    with zipfile.ZipFile(path) as archive:
        assert archive.testzip() is None, 'ZIP CRC validation failed'
        for item in manifest:
            assert digest(archive.read(item['path'])) == item['sha256'], item['path']
    return {'file': path.name, 'files': len(entries), 'bytes': path.stat().st_size, 'sha256': digest(path.read_bytes())}

release_entries = {}
for file in (project / 'dist/client').rglob('*'):
    if file.is_file():
        release_entries['site/' + file.relative_to(project / 'dist/client').as_posix()] = file.read_bytes()
release_entries['worker/index.js'] = (project / 'dist/server/index.js').read_bytes()
for file in (project / 'drizzle').glob('*.sql'):
    release_entries['drizzle/' + file.name] = file.read_bytes()
release_entries['wrangler.json'] = (json.dumps(config, ensure_ascii=False, indent=2) + '\n').encode()
release_entries['部署说明.md'] = instructions.encode()

required = ['site/index.html', 'site/community/index.html', 'site/community/article/index.html',
            'site/join/index.html', 'site/account/index.html', 'site/v2/index.html',
            'drizzle/0000_sturdy_drax.sql', 'drizzle/0001_purple_nocturne.sql', 'worker/index.js']
assert all(name in release_entries for name in required)
for name, data in release_entries.items():
    if name.endswith('.html'):
        for reference in re.findall(r'(?:src|href)="(/(?:assets|media|images)/[^"?#]+)"', data.decode()):
            assert 'site' + reference in release_entries, f'Missing asset {reference}'

source_entries = {}
source_dirs = ['src', 'public', 'worker', 'db', 'drizzle', 'scripts', 'tests', 'account', 'community', 'join', 'v2']
source_files = ['package.json', 'package-lock.json', 'index.html', 'vite.config.ts', 'tsconfig.json',
                'tsconfig.app.json', 'tsconfig.node.json', 'drizzle.config.ts', 'eslint.config.js',
                '.gitignore', '.openai/hosting.json', 'design-qa.md', 'README.md']
for dirname in source_dirs:
    for file in (project / dirname).rglob('*'):
        if file.is_file():
            source_files.append(file.relative_to(project).as_posix())
for relative in source_files:
    file = project / relative
    assert file.is_file(), str(file)
    assert not any(p in {'.git', 'node_modules', '.wrangler', '.sites-runtime', 'tmp'} for p in file.relative_to(project).parts)
    assert not file.name.startswith(('.env', '.dev.vars'))
    source_entries['orilux-ai-source/' + relative] = file.read_bytes()
source_entries['orilux-ai-source/发布说明.md'] = instructions.encode()

results = [write_archive(output / 'ORILUX-AI-发布包.zip', release_entries),
           write_archive(output / 'ORILUX-AI-源码包.zip', source_entries)]
(output / '部署说明.md').write_text(instructions, encoding='utf-8')
(output / 'SHA256SUMS.txt').write_text('\n'.join(r['sha256'] + '  ' + r['file'] for r in results) + '\n', encoding='utf-8')
print(json.dumps({'output': str(output), 'verified': True, 'packages': results}, ensure_ascii=False, indent=2))
