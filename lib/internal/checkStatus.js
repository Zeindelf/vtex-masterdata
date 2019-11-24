const checkStatus = (response) => {
  const { status } = response;
  if (status >= 200 && status < 300) return response;

  return response.json()
    .then((json) => Promise.reject(new Error({
      status,
      ok: false,
      statusText: response.statusText,
      body: json,
    })));
};

export default checkStatus;
