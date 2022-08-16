async function fetchAPI(query, { variables, preview } = {}) {
  const res = await fetch('https://graphql.umbraco.io', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': process.env.UMBRACO_API_KEY,
      'Umb-Project-Alias': process.env.UMBRACO_PROJECT_ALIAS,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
  const json = await res.json()

  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}

export async function getPreviewPostBySlug(slug) {
  const data = await fetchAPI(
    `
    query PostBySlug($slug: String!) {
      post(url: $slug, preview: true) {
        slug:url
      }
    }`,
    {
      preview: true,
      variables: {
        slug,
      },
    }
  )
  return data.post
}

export async function getAllPostsWithSlug() {
  const data = await fetchAPI(`
    {
      allBlogPost {
        edges {
          node {
            slug:url
          }
        }
      }
    }
  `)
  return data.allBlogPost.edges.map((x) => x.node)
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query ($preview: Boolean) {
      blogOverview(url: "/frontend-blog") {
        title
      }
      posts:allBlogPost(orderBy: createDate_DESC, preview: $preview) {
        items {
          title:title
          slug:url
          date:createDate
          coverImage:image {
            url(width: 2000, height: 1000, cropMode: CROP, upscale: true)
          }
          excerpt:summary
        }
      }
    }
  `,
    {
      preview,
      variables: {
        preview,
      },
    }
  )
  return data.posts.items
}

export async function getPostAndMorePosts(slug, preview) {
  const data = await fetchAPI(
    `
    query PostBySlug($slug: String!, $preview: Boolean!) {
      blogPost(url: $slug, preview: $preview) {
        title:name
        slug:url
        date:createDate
        ogImage: image {
            url(width: 2000, height: 1000, cropMode: CROP, upscale: true)
        }
        coverImage:image {
            url(width: 2000, height: 1000, cropMode: CROP, upscale: true)
        }
      }
      morePosts: allBlogPost(first: 2, where: { NOT: { url: $slug } }, orderBy: [createDate_DESC], preview: $preview) {
        edges {
          node {
            title:name
            slug:url
            excerpt:summary
            date:createDate
            coverImage:image {
              url(width: 2000, height: 1000, cropMode: CROP, upscale: true)
            }
          }
        }
      }
    }
  `,
    {
      preview,
      variables: {
        preview,
        slug: `/${slug.join('/')}/`,
      },
    }
  )
  return {
    post: data.blogPost,
    morePosts: data.morePosts.edges.map((e) => e.node),
  }
}

export async function getPostAndMorePosts2(slug, preview) {
  const data = await fetchAPI(
    `
    query PostBySlug($slug: String!, $preview: Boolean!) {
      blogPost(url: $slug, preview: $preview) {
        title:name
        slug:url
        content:rteContent
        date:createDate
        ogImage: image {
            url(width: 2000, height: 1000, cropMode: CROP, upscale: true)
        }
        coverImage:image {
            url(width: 2000, height: 1000, cropMode: CROP, upscale: true)
        }
      }
      morePosts: allBlogPost(first: 2, where: { NOT: { url: $slug } }, orderBy: [createDate_DESC], preview: $preview) {
        edges {
          node {
            title:name
            slug:url
            excerpt:summary
            date:createDate
            coverImage:image {
              url(width: 2000, height: 1000, cropMode: CROP, upscale: true)
            }
          }
        }
      }
    }
  `,
    {
      preview,
      variables: {
        preview,
        slug: `/${slug.join('/')}/`,
      },
    }
  )
  return {
    post: data.blogPost,
    morePosts: data.morePosts.edges.map((e) => e.node),
  }
}
