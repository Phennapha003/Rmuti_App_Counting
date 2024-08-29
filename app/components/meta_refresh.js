import Head from 'next/head';

const RefreshMeta = ({ refreshInterval = 30 }) => (
    <Head>
        <meta httpEquiv="refresh" content={refreshInterval.toString()} />
    </Head>
);

export default RefreshMeta;