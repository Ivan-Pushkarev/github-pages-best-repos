import React from 'react';

function Repo({repo}) {
    return (
        <tr className="repo">
            <td className="repo__avatar">
                <img src={repo.owner.avatar_url} alt="avatar"/>
            </td>
            <td className="repo__name">
                {repo.full_name}
            </td>
            <td className="repo__link">
                <a href={repo.url}>{repo.url}</a>
            </td>
            <td className="repo__owner">
                {repo.owner.login}
            </td>
            <td className="repo__forks">
                {repo.forks}
            </td>
            <td className="repo__issues">
                {repo.open_issues}
            </td>
        </tr>
    );
}

export default Repo;