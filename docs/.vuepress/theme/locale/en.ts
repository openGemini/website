// @ts-ignore
import IoT from '@/assets/images/IoT_en.svg';
// @ts-ignore
import devops from '@/assets/images/devops_en.svg';

const en = {
    navbar: {
        home: 'Home',
        docs: 'Docs',
        blog: 'Blog',
        community: 'Community',
        download: 'Download',
    },
    star: 'Star us on Github',
    community: {
        events: 'Events',
        committer: 'Committer',
        contribution: 'Contribution',
        contact: 'Contact Us',
    },
    title: {
        feature: 'Features',
        scenarios: 'Application Scenarios',
        cooperator: 'Cooperator',
        join: 'Join Us',
    },
    overview: {
        content: `A high-performance, high-reliability, high-scalability, and low-cost distributed time series database which focus on the storage and analysis of massive time series data`,
        btn1: 'Get Started',
        btn2: 'Star For Me',
    },
    features: {
        performance: {
            title: 'High Performance',
            link: 'https://docs.opengemini.org/guide/introduction/performance.html',
            content:
                'Store and query data quickly and efficiently with automatic partitioning, LSM-based storage techniques,  and better data process engineering',
        },
        scalability: {
            title: 'High Scalability',
            link: 'https://docs.opengemini.org/guide/introduction/structure.html',
            content:
                'Adopting MPP architecture, support distributed cluster deployment and can be flexibly expanded as business grows to meet higher load requirements',
        },
        cardinality: {
            title: 'High Cardinality',
            content:
                'A new high cardinality storage engine solves problems such as excessive index memory usage and low read and write performance',
        },
        analysis: {
            title: 'Data Analysis',
            content:
                'Armed with extensive data analysis algorithms, openGemini supports real-time anomaly detection and forecasting reducing the workloads on OPS engineers.',
        },
        om: {
            title: 'Low O&M Costs',
            content:
                'Scure and stable, simple architecture, quick deployment and no third-party dependencies',
        },
        storage: {
            title: 'Data Compression',
            content:
                'Data is stored in column format, and different data types use dedicated data compression algorithms. The data compression ratio is as high as 15:1 or higher',
        },
    },
    scenarios: [
        {
            title: 'Real-time monitoring to view all system running status',
            img: devops,
            content:
                'Monitors the metreics of IT infrastructure and services, ensure the system runs stably.',
        },
        {
            title: 'Time Series Data Analysis',
            img: IoT,
            content:
                'High-performance write data, more than 5x the write performance of InfluxDB. High-performance query data, especially when the query condition contains multiple tags. Distributed cluster, extended as required as possible.',
        },
    ],
    blog: {
        more: 'More',
        viewMore: 'View More',
        category: 'Category',
        recommended: 'Recommended Reading',
        hot: 'Hot',
        all: 'All',
    },
    joinUs: {
        title: 'Community',
        content:
            'Gemini is open source.Star our GitHub repo,follow us on Twitter,and join our developer community on Slack',
        title2: 'Contribution',
        content2:
            'We look forward to working with more enterprises, universities and developers to jointly promote technological innovation',
        btn: 'Contribution Guide',
    },
    footer: {
        privacy: 'Privacy Statement',
        legal: 'Legal Statement',
        resources: 'Resources',
        docker: 'Docker Repository',
        developer: 'Developer',
        contribution: 'Contribution',
        introduction: 'Roadmap',
        support: 'Support',
    },
    time: {
        d: 'd',
        h: 'h',
        m: 'm',
        s: 's',
    },
    category: {
        all: 'All',
        technical: 'Technical',
        company: 'Company',
        casePractice: 'Practice',
        community: 'Community',
        viewpoint: 'Viewpoint',
    },
    events: {
        noEvents: 'No Events',
        all: 'All Events',
        start: 'About to start',
    },
};

export default en;
