import "./styles.css";
import { DetailedHTMLProps, ThHTMLAttributes, useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import {
  getFormattedNumber,
  getNumberFormatInstance,
} from "../../utils/intl/number";
import {
  getFormattedRelativeTime,
  getRelativeTimeFormatInstance,
} from "../../utils/intl/relativeTime";

const GET_REPOSITORIES = gql`
  query ($query: String!, $after: String) {
    search(type: REPOSITORY, query: $query, after: $after, first: 20) {
      count: repositoryCount
      repositories: edges {
        cursor
        repository: node {
          ... on Repository {
            databaseId
            name
            description
            url
            stargazerCount
            pushedAt
            licenseInfo {
              name
            }
          }
        }
      }
    }
  }
`;

interface Props {
  primaryLanguage: "typescript";
  starsLeftBound: number;
}

export default function RepositoriesTableWidget(props: Props) {
  const query = `stars:>=${props.starsLeftBound} language:${props.primaryLanguage} sort:stars-desc`;

  const { loading, error, data, fetchMore } = useQuery(GET_REPOSITORIES, {
    variables: {
      query: query,
    },
  });

  const [fetchesMoreData, setFetchesMoreData] = useState(false);

  function handleFetchMoreData() {
    setFetchesMoreData(true);

    fetchMore({
      variables: {
        query: query,
        after:
          data.search.repositories[data.search.repositories.length - 1].cursor,
      },
    }).finally(() => setFetchesMoreData(false));
  }

  const currentTime = useMemo(() => Date.now(), []);
  const intlNumberFormat = useMemo(() => getNumberFormatInstance("en-US"), []);
  const intlRelativeTimeFormat = useMemo(
    () => getRelativeTimeFormatInstance("en-US"),
    []
  );

  const repositoryCount = data?.search?.count ?? 0;

  return (
    <div>
      <p>
        {loading ? (
          "Loading repositories data.."
        ) : (
          <>
            Found {repositoryCount}{" "}
            {repositoryCount === 1 ? "repository" : "repositories"} across
            GitHub.
          </>
        )}
      </p>
      <table className="RepositoriesTable__table">
        <thead>
          {(() => {
            const commonTableHeaderCellProps: DetailedHTMLProps<
              ThHTMLAttributes<HTMLTableCellElement>,
              HTMLTableCellElement
            > = {
              scope: "col",
              className: "RepositoriesTable__tableHeaderCell",
            };

            return (
              <tr>
                <th {...commonTableHeaderCellProps} data-id="name">
                  Name
                </th>
                <th {...commonTableHeaderCellProps} data-id="description">
                  Description
                </th>
                <th {...commonTableHeaderCellProps} data-id="stars">
                  Stars
                </th>
                <th {...commonTableHeaderCellProps} data-id="license">
                  License info
                </th>
                <th {...commonTableHeaderCellProps} data-id="update">
                  Last update date
                </th>
              </tr>
            );
          })()}
        </thead>
        <tbody>
          {loading &&
            [...Array(4).keys()].map((fakeRow) => (
              <tr key={fakeRow} aria-hidden>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
              </tr>
            ))}
          {data?.search?.repositories?.map(({ repository }: any) => (
            <tr key={repository.databaseId}>
              <th scope="row">
                <a href={repository.url}>{repository.name}</a>
              </th>
              <td>{repository.description}</td>
              <td>
                {getFormattedNumber(
                  repository.stargazerCount,
                  intlNumberFormat
                )}
              </td>
              <td>{repository.licenseInfo?.name ?? "-"}</td>
              <td>
                {getFormattedRelativeTime(
                  Date.parse(repository.pushedAt),
                  currentTime,
                  intlRelativeTimeFormat
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="RepositoriesTable__fetchMoreButton">
        <button
          disabled={loading || fetchesMoreData}
          onClick={handleFetchMoreData}
        >
          {fetchesMoreData ? "Fetching more.." : "Fetch more"}
        </button>
      </div>
      {error != null && <p role="alert">An error occurred.</p>}
    </div>
  );
}
