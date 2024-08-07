// "use client";
// async function getData(param, type = '') {
//     const postData = {
//         method: "GET",
//         next: { revalidate: 0 },
//         headers: {
//             "Content-Type": "application/json"
//         }
//     };

//     const url = type ? `http://localhost:3000/api/${param}?type=${type}` : `http://localhost:3000/api/${param}`;
//     const res = await fetch(url, postData);
//     if (!res.ok) {
//         throw new Error("cannot fetch");
//     }
//     return res.json();
// }

// export default getData;

"use client";
async function getData(param, type = '') {
    const postData = {
        method: "GET",
        next: { revalidate: 0 },
        headers: {
            "Content-Type": "application/json"
        }
    };

    const url = type ? `http://localhost:3000/api/${param}?type=${type}` : `http://localhost:3000/api/${param}`;
    const res = await fetch(url, postData);
    if (!res.ok) {
        throw new Error("cannot fetch");
    }
    return res.json();
}

export default getData;