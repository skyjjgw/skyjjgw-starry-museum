# skyjjgw · 星夜作品馆

梵高《星月夜》背景中的个人作品展览。保留真实个人简介、项目、学习手记和画框内交互。

**这个仓库只包含梵高画框界面及其依赖，不包含另一套独立作品集页面。**

- 在线网站：https://skyjjgw.com/
- 本地运行：`python -m http.server 4174`，然后访问 `http://localhost:4174/`。
- 静态发布：将整个仓库内容部署到静态服务器。`index.html` 即入口。
- 修改资料：编辑四个 `portal-exhibit-*.html`；导航、序言和结尾在入口 HTML 中。
- `portal-tour.js` 控制自动浏览、背景点击、3 秒停留和 2.4 秒转场。
- 打开画框全屏以阅读原尺寸内容；减少动态偏好和暂停按钮均保留。

`assets/home-gallery/gallery.js` 是框内项目交互的预构建依赖，不是第二个独立作品集页面。
公开文件采用依赖白名单导出；未包含服务器地址、SSH 密钥、环境配置或部署脚本。

此仓库是个人站的静态发布快照；无需安装 npm。预构建的交互组件源代码和再构建配置不完整包含在此快照中。匿名投稿模板在独立仓库维护，不能用这份真实资料版本代替投稿包。

## 授权

第三方代码和素材保留各自原始授权，见 `ATTRIBUTION.md` 和 `assets` 中的 LICENSE 文件。
个人简介、品牌和项目素材未额外授予通用模板再分发许可。

## 联系

- 个人网站：[skyjjgw.com](https://skyjjgw.com)
- 邮箱：[skyjjgw@gmail.com](mailto:skyjjgw@gmail.com)
