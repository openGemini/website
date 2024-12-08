export type TCMember = {
    name: string;
    enName: string;
    img: string;
    email: string;
    github: string;
    title: string;
    imgPosition?: 'top' | 'center' | 'bottom';
};

export const committerInfo = {
    maintainer: {
        groupName: 'Maintainer',
        requirements: [
            'Sponsor from 2 Maintainer',
            'Committer for at least 6 months',
            'Independently develop at least one feature',
            'Good technical judgement in feature design/development',
        ],
        requirements_zh: [
            '至少由2个其他Maintainer的推荐',
            '担任Committer至少6个月以上',
            '完成至少一个以上的特性开发',
            '在功能设计/开发方面有良好的技术判断力',
        ],
        responsibilities: [
            'Participate in release planning',
            'Maintain project code quality',
            'Ensure API compatibility with forward/backward versions based on feature graduation criteria',
            'Analyze and propose new features/enhancements in openGemini project',
            'Demonstrate sound technical judgementL',
            'Mentor contributors and committers',
            'Have top level write access to relevant repository (able click Merge PR button when manual check-in is necessary)',
            'Name entry in Maintainers file of the repository',
            'Participate & Drive design/development of multiple features',
        ],
        responsibilities_zh: [
            '参与发布计划',
            '维护项目代码质量',
            '确保API前后版本的兼容性',
            '分析并提出openGemini项目中的新特性/优化',
            '具备良好的技术判断力',
            '为Committer和Contributor提供技术指导',
            '拥有社区项目的顶级访问权限',
            '写入相关项目仓的MAINTAINER文件',
            '参与和推动多种功能的设计/开发',
        ],
        member: [
            {
                name: '刘超',
                enName: 'Chao Liu',
                img: '/images/member/liuchao.jpg',
                // imgPosition: 'center', // 用来微调图片展示位置
                email: 'liuchao171@huawei.com',
                github: 'https://github.com/MrSanZhi',
            },
            {
                name: '范祥',
                enName: 'Xiang Fan',
                img: '/images/member/fanxiang.jpg',
                email: 'fx4084@gmail.com',
                github: 'https://github.com/fx408',
            },
            {
                name: '向宇',
                enName: 'Yu Xiang',
                img: '/images/member/xiangyu.jpg',
                email: 'xiangyu5632@126.com',
                github: 'https://github.com/xiangyu5632',
            },
            {
                name: '贺张俭',
                enName: 'ZhangJian He',
                img: '/images/member/hezhangjian.jpg',
                email: 'shoothzj@gmail.com',
                github: 'https://github.com/shoothzj',
            },
            {
                name: '李仕林',
                enName: 'Shilin Lee',
                img: '/images/member/lishilin.jpg',
                email: 'shilinlee.ghost@gmail.com',
                github: 'https://github.com/shilinlee',
            },
        ],
    },
    commiter: {
        groupName: 'Committer',
        requirements: [
            'Sponsor from 2 maintainers',
            'Review for at least 3 months',
            'Have reviewed good number of PRs',
            'Contributing to the community for at least 6 months',
            'Have good codebase knowledge',
        ],
        requirements_zh: [
            '至少2个Maintainer的推荐',
            '代码Review至少3个月',
            '对PR进行审核',
            '在社区持续贡献至少6个月',
            '熟悉openGemini代码',
        ],
        responsibilities: [
            'Review code to maintain/improve code quality',
            'Acknowledge and work on review requests from community members',
            'May approve code contributions for acceptance related to relevant expertise',
            "Have 'write access' to specific packages inside a repo, enforced via bot",
            'Continue to contribute and guide other community members to contribute in openGemini project',
        ],
        responsibilities_zh: [
            '审查代码以保持/提高代码质量',
            '确认并处理来自社区成员PR Review请求',
            '批准相关的代码贡献合入主干',
            '拥有相关代码仓的写权限',
            '长期贡献并指导社区其他Contributor/member为项目做出贡献',
        ],
        member: [
            {
                name: '黄飞腾',
                enName: 'FeiTeng Huang',
                img: '/images/member/huangfeiteng.jpg',
                // imgPosition: 'center', // 用来微调图片展示位置
                email: 'huangfeiteng@huawei.com',
                github: 'https://github.com/huang-feiteng',
            },
            {
                name: '李伟琪',
                enName: 'WeiQi Li',
                img: '/images/member/liweiqi.jpg',
                email: 'liweiqi4@huawei.com',
                github: 'https://github.com/vicky-run',
            },
            {
                name: '周益剑',
                enName: 'YiJian Zhou',
                img: '/images/member/zhouyijian.png',
                email: 'zhouyijian@huawei.com',
                github: 'https://github.com/scuzyj',
            },
            {
                name: '谢伟',
                enName: 'Wei Xie',
                img: '/images/member/xiewei.jpg',
                email: 'ampedee@gmail.com',
                github: 'https://github.com/waynerv',
            },
            {
                name: '谌旭琳',
                enName: 'XuLin Chen',
                img: '/images/member/shenxulin.jpg',
                email: 'chenxulin295@163.com',
                github: 'https://github.com/Chenxulin97',
            },
            {
                name: '王伟平',
                enName: 'WeiPing Wang',
                img: '/images/member/wangweiping.jpg',
                email: 'hustwaitone@163.com',
                github: 'https://github.com/weiping-code',
            },
            {
                name: '徐业',
                enName: 'Ye Xu',
                img: '/images/member/xuye.png',
                email: 'xuthus5@gmail.com',
                github: 'https://github.com/xuthus5',
            },
        ],
    },
};
