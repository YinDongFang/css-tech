const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { load, dump } = require('js-yaml');

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

exports.getRepoCreatedAt = async function (repo, token) {
  const { data } = await axios.get(`https://api.github.com/repos/${repo}`, {
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
      Authorization: token ? `token ${token}` : '',
    },
  });

  return data.created_at;
}

exports.getRepoStarRecords = async function (repo, token) {
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

exports.getRepoLogoUrl = async function (repo, token) {
  const owner = repo.split('/')[0];
  const { data } = await axios.get(`https://api.github.com/users/${owner}`, {
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
      Authorization: token ? `token ${token}` : '',
    },
  });

  return data.avatar_url;
}

const YAML_DIR_PATH = path.join(process.cwd(), 'data');

exports.getProjects = function () {
  const projectFiles = fs.readdirSync(path.join(YAML_DIR_PATH, 'projects'));
  const projects = projectFiles.map(filename => {
    const project = load(fs.readFileSync(path.join(YAML_DIR_PATH, 'projects', filename)));
    project.filename = filename;
    return project;
  });
  return projects;
}

exports.saveProjects = function (projects) {
  projects.forEach(project => {
    const filename = project.filename;
    delete project.filename;
    fs.writeFileSync(path.join(YAML_DIR_PATH, 'projects', filename), dump(project));
  });
}

exports.getNpmPkgName = function (project) {
  return project.npm || project.repo.split('/')[1];
}

async function getDownloadsOfDate(year, month, npmPkgNames) {
  const daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const endTime = `${year}-${month < 10 ? '0' + month : month}-${daysOfMonth[month - 1]}`;
  return await axios.get(`https://api.npmjs.org/downloads/point/${year}-01-01:${endTime}/${npmPkgNames.join(',')}`);
}

exports.updateDownloads = async function (projects) {
  const FROM = 1996;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const totalDownloads = {};
  projects.forEach(project => {
    project.npmPkgName = project.repo.split('/')[1];
    totalDownloads[project.npmPkgName] = 0;
  });
  const npmPkgNames = projects.map(project => project.npmPkgName);

  for (let year = FROM; year < currentYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const stringDate = `${year}/${month < 10 ? '0' + month : month}`;
      const missedProjects = projects
        .filter(project => {
          const firstVersionTime = project.versions[0].time;
          return firstVersionTime < stringDate || firstVersionTime === stringDate;
        })
        .filter(project => {
          return !project.donwloads.find(downloadInfo => downloadInfo.time === stringDate);
        });
      if (missedProjects.length) {
        const data = await getDownloadsOfDate(year, month, npmPkgNames);
        missedProjects.forEach(project => {
          miss
        });
      }
    }
  }

  projects.forEach(project => {
    delete project.npmPkgName;
  });

  return projects;
}