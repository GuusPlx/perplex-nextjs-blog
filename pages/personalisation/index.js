import Container from '../../components/container'
import MoreStories from '../../components/more-stories'
import HeroPost from '../../components/hero-post'
import Intro from '../../components/intro'
import Layout from '../../components/layout'
import { getAllPostsForHome } from '../../lib/umbraco-heartcore'
import Head from 'next/head'
import { CMS_NAME, CMS_URL } from '../../lib/constants'

export default function Index({ posts, preview }) {
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
      </Layout>
    </>
  )
}

export async function getStaticProps({ preview = false }) {
  const posts = (await getAllPostsForHome(preview)) || []
  return {
    props: { posts, preview },
    revalidate: 10, // In seconds
  }
}
