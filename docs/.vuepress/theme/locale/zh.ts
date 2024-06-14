// @ts-ignore
import IoT from '@/assets/images/IoT.svg';
// @ts-ignore
import devops from '@/assets/images/devops.svg';

const zh = {
    navbar: {
        home: '首页',
        docs: '文档',
        blog: '博客',
        community: '社区',
        download: '下载',
    },
    star: 'Star',
    community: {
        events: '活动',
        committer: '贡献者',
        contribution: '贡献',
        contact: '联系我们',
        opensource_star: '开源之星',
    },
    title: {
        feature: '特性',
        scenarios: '应用场景',
        cooperator: '合作者',
        join: '加入我们',
    },
    overview: {
        content:
            '专注海量时序数据存储和分析，一个高性能、高可靠、高扩展、低成本的分布式时序数据库管理系统',
        btn1: '开始使用',
        btn2: 'Star For Me',
    },
    features: {
        performance: {
            title: '高性能',
            link: 'https://docs.opengemini.org/zh/guide/introduction/performance.html',
            content: '高吞吐、高并发、低时延。支持数据高速写入，能够快速响应大量查询请求',
        },
        scalability: {
            title: '高扩展',
            link: 'https://docs.opengemini.org/zh/guide/introduction/structure.html',
            content:
                '采用MPP架构，支持分布式集群部署，可以随着业务的增长而灵活扩展，以满足更高的负载需求, 支持100+节点',
        },
        cardinality: {
            title: '高基数',
            link: 'https://docs.opengemini.org/zh/guide/features/high_series_cardinality.html',
            content:
                '全新存储引擎，不受时间线数量限制，解决时序数据高基数带来的索引膨胀、内存资源占用过高、读写性能下降等问题',
        },
        analysis: {
            title: '存储分析一体化',
            content:
                '内置AI数据分析平台，提供了对时序数据的实时异常检测能力，实现了数据从存储到分析完整的闭环管理',
        },
        om: {
            title: '运维成本低',
            content:
                '提供260+项系统运行监控指标，快速提升问题解决的效率。部署过程中不依赖任何第三方组件和应用，极大降低了运维难度和成本',
        },
        storage: {
            title: '高数据压缩率',
            link: 'https://docs.opengemini.org/zh/guide/kernel/data_compress.html',
            content:
                '数据采用列式存储，不同数据类型采用专用数据压缩算法，数据压缩比高达15:1或者更高',
        },
    },
    scenarios: [
        {
            title: '运维监控',
            img: devops,
            content:
                'openGemini具备卓越的读写性能，提供了水平扩展能力，支持数百节点集群规模，支持数据分级存储和高效数据压缩能力，满足了运维监控领域对数据存储、资源扩容、大规模数据并发写入以及数据分析的需求。',
        },
        {
            title: '物联网数据存储底座',
            img: IoT,
            content:
                '近些年来物联网技术高速发展，广泛应用到了诸如工业物联网、车联网、智能家居、智能建筑、智慧医疗、智慧养老、智慧农业等场景中，无论是何种场景的应用，都离不开对数据的“采集-处理-存储-分析-展示”这一基本流程。openGemini具有高性能、分布式、部署灵活等特性，支持亿级时间线管理和纳秒级时间精度，可满足工业物联网领域中海量数据存储、高吞吐量数据读写的需求',
        },
    ],
    blog: {
        more: '更多',
        viewMore: '查看更多',
        category: '分类',
        recommended: '推荐阅读',
        hot: '热门标签',
        all: '全部',
    },
    joinUs: {
        title: '加入我们的开发者社区',
        content: 'openGemini已开源。关注我们的GitHub及微信公众号，并关注我们的知乎社区',
        title2: '欢迎加入社区贡献',
        content2:
            'openGemini是一个开放、包容、合作的社区平台。期待与更多企业、高校、开发者携手，共同推动技术创新openGemini共创新、赢未来',
        btn: '贡献指南',
    },
    footer: {
        privacy: '隐私声明',
        legal: '法律声明',
        resources: '资源中心',
        docker: 'Docker仓库',
        developer: '开发者社区',
        contribution: '贡献指南',
        roadmap: '路线图',
        support: '支持',
    },
    time: {
        d: '天',
        h: '时',
        m: '分',
        s: '秒',
    },
    category: {
        all: '全部',
        technical: '技术解读',
        company: '公司动态',
        casePractice: '案例实践',
        community: '社区动态',
        viewpoint: '观点洞察',
    },
    events: {
        noEvents: '暂无活动',
        all: '所有活动',
        start: '即将开始',
    },
    committer: {
        requirements: '要求',
        responsibilities: '职责',
    },
    opensource_star: {
        title: '社区开源之星',
        link: '他们在社区的故事',
    },
};

export default zh;
