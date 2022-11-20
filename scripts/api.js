const axios = require('axios');

const DEFAULT_PER_PAGE = 100;

async function getRepoStargazers(repo, token, page) {
  let url = `https://api.github.com/repos/${repo}/stargazers?per_page=${DEFAULT_PER_PAGE}`;

  if (page !== undefined) {
    url = `${url}&page=${page}`;
  }
  return axios.get(url, {
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
      Authorization: token ? `token ${token}` : '',
    },
  });
}

async function getRepoCreatedAt(repo, token) {
  const { data } = await axios.get(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
      Authorization: token ? `token ${token}` : '',
    },
  });

  return data.created_at;
}

async function getRepoStarRecords(repo, token) {
  const patchRes = await getRepoStargazers(repo, token);

  const headerLink = patchRes.headers['link'] || '';

  let pageCount = 1;
  const regResult = /next.*&page=(\d*).*last/.exec(headerLink);

  if (regResult) {
    if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
      pageCount = Number(regResult[1]);
    }
  }

  if (pageCount === 1 && patchRes?.data?.length === 0) {
    throw {
      status: patchRes.status,
      data: [],
    };
  }

  console.log(pageCount);

  const requestPages = new Array(pageCount).fill(0).map((_, i) => i + 1);
  const resArray = await Promise.all(
    requestPages.map((page) => getRepoStargazers(repo, token, page))
  );

  const starRecordsMap = new Map();

  const starRecordsData = resArray.flatMap((res) => res.data);
  starRecordsData.forEach((data) => {
    const date = data.starred_at.substr(0, 7);
    starRecordsMap.set(date, (starRecordsMap.get(date) || 0) + 1);
  });

  const starRecords = Array.from(starRecordsMap.entries())
    .map(([k, v]) => ({ date: k.replace('-', '/'), count: v }))
    .sort(({ date: a }, { date: b }) => (a > b ? 1 : -1));
  starRecords.forEach((record, index) => {
    record.total =
      index > 0 ? record.count + starRecords[index - 1].total : record.count;
  });

  return starRecords;
}

async function getRepoLogoUrl(repo, token) {
  const owner = repo.split('/')[0];
  const { data } = await axios.get(`https://api.github.com/users/${owner}`, {
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
      Authorization: token ? `token ${token}` : '',
    },
  });

  return data.avatar_url;
}

async function load() {
  const data = await getRepoStarRecords('slidevjs/slidev', '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');
  console.log(data);
}

load();
