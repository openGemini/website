const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));

if (!args.name) {
    throw Error('缺少参数---name');
}
let path = args.zh ? './docs/zh' : './docs';
path += args.event ? `/community/events/${args.name}.md` : `/blog/${args.name}.md`;

const fileText = args.event
    ? `---
events: true
title: 
author: 
abstract: 
cover: /images/cover/${args.name}.png
eventDate: 
pinned: false
---
    `
    : `---
blog: true
title: 
pubDate: ''
author: 
abstract: 
cover: /images/cover/${args.name}.png
recommend: 0
# category: 技术解读 公司动态 案例实践 社区动态 观点洞察
category: 
tag: openGemini
---


---

**更多资讯可关注 openGemini 公众号和视频号。如果您对 openGemini 相关技术感兴趣，欢迎到社区与大家进行相关技术讨论。**

<div align=center>
<img src="/images/qrcode.jpg" >
</div>
`;

fs.access(path, (err) => {
    if (err) {
        fs.writeFile(path, fileText, (err) => {
            if (err) {
                console.log(err);
            }
        });
    } else {
        throw Error('文件已存在');
    }
});
