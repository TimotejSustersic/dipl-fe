
export async function API_POST(
  url: string,
  params: object = {},
  succClb?: (params: unknown) => void,
  errClb?: (params: unknown) => void,
) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, {
      method: "POST",
      body: JSON.stringify(params),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      }, 
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const responseData = await response.json();

    if (succClb) succClb(responseData);
  } catch (error) {
    if (errClb) errClb(error);
  }
}