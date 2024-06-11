import path from "path";
import ContentsDAO from "../dao/contentsDAO.js";

export default class ContentsController {
  static async apiPostContent(req, res, next) {
    try {
      const title = req.body.title;
      const subText = req.body.subText;
      const contentBody = req.body.contentBody;
      let attachments;
      if (req.file) {
        attachments = req.file.path;
      }
      const url = req.body.url;
      const author = req.body.author;
      const showAuthor = req.body.showAuthor;
      const publishDate = req.body.publishDate;
      const publishTime = req.body.publishTime;
      const createdAt = req.body.createdAt;
      const modifiedAt = req.body.modifiedAt;
      const createdBy = req.body.createdBy;
      const modifiedBy = req.body.modifiedBy;
      const status = req.body.status;

      const contentResponse = await ContentsDAO.addContent(
        title,
        subText,
        contentBody,
        attachments,
        url,
        author,
        showAuthor,
        publishDate,
        publishTime,
        createdAt,
        modifiedAt,
        createdBy,
        modifiedBy,
        status
      );

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetBlogs(req, res, next) {
    try {
      let id = req.params.id || {};
      let blogs = await ContentsDAO.getBlogsByUser(id);

      if (!blogs) {
        res.status(404).json({ error: "Not found" });
      }

      res.json(blogs);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetPublishedPages(req, res, next) {
    try {
      let pages = await ContentsDAO.getPublishedBlogs();

      if (!pages) {
        res.status(404).json({ error: "Not found" });
      }

      res.json(pages);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e.message });
    }
  }

  static async apiDeletePage(req, res, next) {
    try {
      const pageId = req.params.id;
      const pageResponse = await ContentsDAO.deletePage(pageId);
      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }

  static async apiGetPageData(req, res, next) {
    try {
      let id = req.params.id || {};
      let page = await ContentsDAO.getPageData(id);

      if (!page) {
        res.status(404).json({ error: "Not found" });
        return;
      }

      res.json(page);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetPageBySlug(req, res, next) {
    try {
      let id = req.params.id;
      let page = await ContentsDAO.getPageBySlug(id);
      if (!page) {
        console.log("error hehe");
        res.status(404).json({ error: "Not found" });
        return;
      }

      let hasAttachment;
      let downloadLink;

      if(page.attachments){
        hasAttachment = true;
        downloadLink = "http://localhost:8000/api/v1/contents/download/" + page.attachments;
      } else {
        hasAttachment = false;
      }

      let htmlResponse = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <title>${page.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link
                  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
                  rel="stylesheet"
                  integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
                  crossorigin="anonymous"
                />
              </head>
              <body>
                <section class="vh-100">
                    <div class="flex-column h-100 d-flex justify-content-center align-items-center">
                        <div>
                            <h1>${page.title}</h1>
                        </div>
                        <div>
                            <h5>${page.subText}</h5>
                        </div>
                        <div>
                        ${page.contentBody}
                        </div>
                        <div id="author">
                            ${page.author}
                        </div>
                        <div class="mt-3" id="attachments">
                            <a class="border border-dark p-1" style="text-decoration: none; color: black;" id="downloadbt">Download Attachments</a>
                        </div>
                    </div>
                </section>
                <script
                  src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
                  integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
                  crossorigin="anonymous"
                ></script>
                <script>
                    let showAuthor = ${page.showAUthor};
                    let shoAuthorDiv = document.getElementById("author");
                    if(showAuthor){
                        shoAuthorDiv.style.display = "block";
                    } else {
                        shoAuthorDiv.style.display = "none";
                    }

                    let showAttachments = document.getElementById("attachments");
                    if(${hasAttachment}){
                      let downloadBt = document.getElementById("downloadbt");
                      downloadBt.setAttribute("href", "${downloadLink}" );
                      showAttachments.style.display = "block";
                    } else {
                      showAttachments.style.display = "none";
                    }
                </script>
              </body>
            </html>
            `;
      res.send(htmlResponse);
    } catch (e) {
      console.log(`api, ${e}`);
      res.status(500).json({ error: e });
    }
  }

  static async apiGetFile(req, res, next){
    try{
        const filename = req.params.id;

        if(!filename){
            return res.status(400).json({ error: "Filename is required in query parameters" });
        }

        const filePath = path.join("/home/ad.rapidops.com/yuvrajsinh.chauhan/Yuvrajsinh-Chauhan/Javascript Final Review Task/BACKEND/uploads",filename);

        res.download(filePath, filename, (err) => {
            if(err){
                console.error("Error downloading file: ",err);
                res.status(500).json({error: "Internal Server Error"});
            }
        });
    } catch(error){
        console.error("Error: ", error);
        res.status(500).json({ error: "Internal Server Error"});
    }
  }

  static async apiUpdatePage(req, res, next) {
    try {
      const pageId = req.params.id;
      const title = req.body.title;
      const subText = req.body.subText;
      const contentBody = req.body.contentBody;
      const url = req.body.url;
      const author = req.body.author;
      const showAuthor = req.body.showAuthor;
      const publishDate = req.body.publishDate;
      const publishTime = req.body.publishTime;
      const modifiedAt = req.body.modifiedAt;
      const modifiedBy = req.body.modifiedBy;

      const pageResponse = await ContentsDAO.updatePage(
        pageId,
        title,
        subText,
        contentBody,
        url,
        author,
        showAuthor,
        publishDate,
        publishTime,
        modifiedAt,
        modifiedBy
      );

      var { error } = pageResponse;

      if (error) {
        res.status(400).json({ error });
      }

      if (pageResponse.modifiedCount === 0) {
        throw new Error("Unable to update page");
      }

      res.json({ status: "success" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}
