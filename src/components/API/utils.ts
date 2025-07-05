/* eslint-disable @typescript-eslint/no-explicit-any */

export async function API_POST(
  url: string,
  params: object = {},
  succClb?: (params: any) => void,
  errClb?: (params: any) => void,
) {
  try {
    console.log(process.env.NEXT_PUBLIC_API_URL)
    console.log(process.env.NEXT_PUBLIC_API_URL + url)
    console.log(url)
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