import React from "react";
import { graphql, navigate } from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import BreadCrumbs from "../components/ui/BreadCrumbs";
import { pathOrParentIdToGitHubLink } from "../js/utils";
import LinkToGithub from "../components/ui/LinkToGithub";
import { template_h1_css } from "../js/styles";
import RouteGradeChip from "../components/ui/RouteGradeChip";
import RouteTypeChips from "../components/ui/RouteTypeChips";
import ClimbDetail from "../components/graphql/ClimbDetail";

/**
 * Templage for generating individual page for the climb
 */
export default function ClimbPage({ data: { climb } }) {
  const { route_name, yds, type, safety, fa } = climb.frontmatter;
  const { rawPath, filename, pathTokens, parent } = climb;
  const githubLink = pathOrParentIdToGitHubLink(rawPath, filename);

  return (
    <Layout>
      {/* eslint-disable react/jsx-pascal-case */}
      <SEO
        keywords={[route_name]}
        title={route_name}
        description={buildMetaDescription(pathTokens, fa, yds)}
      />
      <div>
        <BreadCrumbs pathTokens={pathTokens} isClimbPage={true} />
        <h1 className={template_h1_css}>{route_name}</h1>
        <RouteGradeChip yds={yds} safety={safety}></RouteGradeChip>
        <RouteTypeChips type={type}></RouteTypeChips>
        <div className="pt-4 text-sm text-gray-600 italic">FA: {fa}</div>
        <div className="float-right">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/edit?file=${rawPath}/${filename}.md`)}
          >
            Improve this page
          </button>
        </div>
        <div
          className="markdown"
          dangerouslySetInnerHTML={{ __html: parent.html }}
        ></div>
      </div>
      <LinkToGithub link={githubLink} docType="climbs"></LinkToGithub>
    </Layout>
  );
}

function buildMetaDescription(pathTokens, fa, yds) {
  const pathLength = pathTokens.length;
  const area = `${pathTokens[pathLength - 2]} at ${
    pathTokens[pathLength - 3]
  } `;
  const firstAscent = fa ? `First ascent by ${fa} - ` : "";
  return `${firstAscent}${yds} - Located in ${area}`;
}

export const query = graphql`
  query ($node_id: String!) {
    climb: climb(id: { eq: $node_id }) {
      ...ClimbDetailFragment
      parent {
        ... on MarkdownRemark {
          html
        }
      }
    }
  }
`;
