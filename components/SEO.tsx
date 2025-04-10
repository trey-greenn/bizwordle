import Head from 'next/head';

type SEOProps = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article';
  structuredData?: object | null;
};

const SEO = ({
    // ... existing code ...
    title = 'Biz Wordle - Guess the Mystery Fortune 500 Company',
    description = 'Engage in Biz Wordle, the ultimate guessing game for business enthusiasts. Test your knowledge of Fortune 500 companies by guessing the mystery company in a limited number of tries. Discover interesting facts about top global businesses and their leaders while enjoying a fun and educational experience.',
    url = 'www.businesswordle.com',
  image = '/wordle.png',
  type = 'website',
  structuredData = null,
}: SEOProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
};

export default SEO;
