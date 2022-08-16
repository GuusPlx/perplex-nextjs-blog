import Container from '../../components/container'
import MoreStories from '../../components/more-stories'
import HeroPost from '../../components/hero-post'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import { getAllPostsForHome } from '../../lib/umbraco-heartcore'
import Head from 'next/head'
import { CMS_NAME, CMS_URL } from '../../lib/constants'
import Script from 'next/script'

export default function Index({ posts, preview, characters, umsCssJsData }) {
  const heroPost = posts[0]
  const morePosts = posts.slice(1)
  return (
    <>
      <Layout preview={preview}>
        <Head>
          <title>Next.js Blog Example with {CMS_NAME}</title>
        </Head>
        <Container>
          <section className="flex flex-col items-center mt-16 mb-16 md:flex-row md:justify-between md:mb-12">
            <h1 className="text-6xl font-bold leading-tight tracking-tighter md:text-8xl md:pr-8">
              Blog.
            </h1>
            <h4 className="mt-5 text-lg text-center md:text-left md:pl-8">
              A personalized variant of the homepage, that could be server side rendered{' '}
              <a
                href="https://nextjs.org/"
                className="underline transition-colors duration-200 hover:text-success"
              >
                Next.js
              </a>{' '}
              and{' '}
              <a
                href={CMS_URL}
                className="underline transition-colors duration-200 hover:text-success"
              >
                {CMS_NAME}
              </a>
              .
            </h4>
          </section>
          <section className="my-10">
            <h2 className="mb-6 text-3xl font-bold text-purple-500">Onderstaande character content wordt serverside opgehaald op client request</h2>
            <h3 className="my-4 text-xl font-bold">Scripts en styles die worden ingeladen:</h3>
            <h4 className="my-2 font-bold">Styles:</h4>
            <pre>{umsCssJsData.css}</pre>
            <h4 className="my-2 font-bold">Scripts:</h4>
            <pre>{umsCssJsData.js}</pre>
            <h3 className="my-4 text-xl font-bold">Rick en morty characters worden opgehaald van externe content api:</h3>
            <ul className="grid gap-3 lg:grid-cols-3">
              {characters.map((character) => (
                <li>{character.name}</li>
              ))}
            </ul>
          </section>
          {heroPost && (
            <HeroPost
              title={heroPost.title}
              coverImage={heroPost.coverImage}
              date={heroPost.date}
              author={heroPost.author}
              slug={heroPost.slug}
              excerpt={heroPost.excerpt}
            />
          )}
          {morePosts.length > 0 && <MoreStories posts={morePosts} />}
        </Container>
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: umsCssJsData.js,
          }}
        />
        <style>{umsCssJsData.css}</style>
      </Layout>
    </>
  )
}

export async function getServerSideProps({ req, res}) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  
  // Fetch data from external API
  const rmResponse = await fetch(`https://rickandmortyapi.com/api/character`)
  const characterData = await rmResponse.json()
  const characters = characterData?.results

  const umsResponse = await fetch(`${process.env.UMS_ENDPOINT}/personalised-js-and-css`)
  const umsCssJsData = await umsResponse.json()
  
  const posts = (await getAllPostsForHome()) || []

  // Pass data to the page via props
  return { props: { posts, characters, umsCssJsData } }
}
