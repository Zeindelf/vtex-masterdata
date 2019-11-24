const parseJson = (response) => {
  const { status } = response;

  return status === 204 || status === 205 ? { ok: true } : response.json();
};

export default parseJson;
