export function extract(data: any, path: string) {
  let current: any = data;
  const pathSplits = path.split('.');
  for (const pathSplit of pathSplits) {
    if (current[pathSplit] === undefined) {
      return undefined;
    }
    current = current[pathSplit];
  }
  return current;
}

export function parseQuery(queryString): Record<string, string> {
  const query = {};
  const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}