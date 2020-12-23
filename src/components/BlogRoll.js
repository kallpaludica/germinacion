import React from "react";
import PropTypes from "prop-types";
import { Link, graphql, StaticQuery } from "gatsby";
import PreviewCompatibleImage from "./PreviewCompatibleImage";
import styled from "@emotion/styled"
import tw from "twin.macro"

class BlogRoll extends React.Component {
  render() {
    const { data } = this.props;
    const { edges: posts } = data.allMarkdownRemark;

    return (
      <Container>
        {posts &&
          posts.map(({ node: post }) => (
            <div key={post.id}>
              <article
                className={`blog-list-item tile border-b  is-child box notification ${
                  post.frontmatter.featuredpost ? "is-featured" : ""
                }`}
              >
                <header>
                  {post.frontmatter.featuredimage ? (
                    <div className="relative w-full h-48 overflow-hidden featured-thumbnail">
                      <PreviewCompatibleImage
                        imageInfo={{
                          image: post.frontmatter.featuredimage,
                          alt: `featured image thumbnail for post ${post.frontmatter.title}`,
                        }}
                      />
                    </div>
                  ) : null}
                  <p className="mb-2 prose post-meta">
                    <Link className="text-xl" to={post.fields.slug}>
                      {post.frontmatter.title}
                    </Link>
                    <span> &bull; </span>
                  </p>
                  <span className="hidden">
                    {post.frontmatter.date}
                  </span>
                </header>
                <p className="mb-3 prose">
                  {post.excerpt}
                  <br />
                  <Link className="button" to={post.fields.slug}>
                    Seguir leyendo →
                  </Link>
                  <br />

                </p>
              </article>
            </div>
          ))}
      </Container>
    );
  }
}

BlogRoll.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.array,
    }),
  }),
};

export default () => (
  <StaticQuery
    query={graphql`
      query BlogRollQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
          limit: 6
        ) {
          edges {
            node {
              excerpt(pruneLength: 80)
              id
              fields {
                slug
              }
              frontmatter {
                title
                templateKey
                date(formatString: "MMMM DD, YYYY")
                featuredpost
                featuredimage {
                  childImageSharp {
                    fluid(maxWidth: 600, quality: 100) {
                      ...GatsbyImageSharpFluid
                    }
                  }
                }
              }
            }
          }
        }
      }
    `}
    render={(data, count) => <BlogRoll data={data} count={count} />}
  />
);

const Container = styled.div`
  ${tw`grid gap-6 my-12 md:grid-cols-3 `}
`
