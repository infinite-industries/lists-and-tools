/* If you're feeling fancy you can add interactivity
    to your site with Javascript */

// prints a message in the browser's dev tools console
console.log("Hello 🌎");

const infinite_container = document.querySelector("#orglist-container");

const InfiniteRenderOrg = org => {
  let org_template = `
      <ul>
  <li class="title-container"><b class="title">${org.arts_group}</b></li>`;

  if (org.contact !== undefined) {
    org_template += `<li>${org.contact}</li>`;
  }
  if (org.email !== undefined) {
    org_template += `<li><a href="mailto:${org.email}" target="_blank">${org.email}</a></li>`;
  }

  if (org.phone !== undefined) {
    org_template += `<li><i><a href="tel:${org.phone}" target="_blank">${org.phone}</a></i></li>`;
  }
  if (org.website !== undefined) {
    org_template += `<li class="website-container"><a href="${
      org.website.slice(4) !== "http" ? "http://" : ""
    }${org.website}" target="_blank">${org.website}</a></li>`;
  }
  if (org.mission_statement !== undefined) {
    org_template += `<li><p class="mission">${org.mission_statement}</p></li>`;
  }
  org_template += `</ul>`;

  const org_element = document.createElement("div");
  org_element.setAttribute("class", "org-listing");
  org_element.innerHTML = org_template;

  return org_element;
};

const infinite_config = {
  headers: { Authorization: "Bearer keyW7jLTY5YiGYcbG" }
};

// recursive data load because airtable limits us to 100 records / request and 5 requests / second
function loadPageOfData(offset) {
  let url =
    "https://api.airtable.com/v0/appecCUZUIL1mgG2d/List%20of%20Organizations/?pageSize=50&view=Grid%20view";
  if (offset) url += "&offset=" + offset;
  axios
    .get(url, infinite_config)
    .then(function(response) {
      // offset is the next block of records
      const { offset, records } = response.data;
      // process these records
      records.forEach(record => {
        // console.log(record.fields)
        infinite_container.appendChild(InfiniteRenderOrg(record.fields));
      });
      // offset is empty if we're at the end of the table
      // delay next call to avoid hitting the rate limit
      if (offset && offset != 0)
        setTimeout(function() {
          loadPageOfData(offset);
        }, 250);
    })
    .catch(function(error) {
      // error.response.status === 429 means we're throttled
      // need to avoid this case if at all possible because we won't be able
      // to make another request for 30 seconds
      // perhaps setTimeout(function () { loadPageOfData(offset) }, 1000 * 35)
      console.error(error);
    });
}

loadPageOfData();
