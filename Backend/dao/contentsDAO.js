import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let contents;

export default class ContentsDAO {
  static async injectDB(conn) {
    if (contents) {
      return;
    }

    try {
      contents = await conn.db("users").collection("contents");
    } catch (e) {
      console.error(
        `Unable to establish connection handles in contentsDAO: ${e}`
      );
    }
  }

  static async addContent(
    title,
    subText,
    contentBody,
    attachments,
    url,
    author,
    showAUthor,
    publishDate,
    publishTime,
    createdAt,
    modifiedAt,
    createdBy,
    modifiedBy,
    status
  ) {
    try {
      const contentDoc = {
        title: title,
        subText: subText,
        contentBody: contentBody,
        attachments: attachments,
        url: url,
        author: author,
        showAUthor: showAUthor,
        publishDate: publishDate,
        publishTime: publishTime,
        createdAt: createdAt,
        modifiedAt: modifiedAt,
        createdBy: createdBy,
        modifiedBy: modifiedBy,
        status: status,
      };

      return await contents.insertOne(contentDoc);
    } catch (e) {
      console.error(`Unable to add blog: ${e}`);
      return { error: e };
    }
  }

  static async getBlogsByUser(user) {
    try {
      const cursor = await contents.find({ createdBy: user });
      return cursor.toArray();
    } catch (e) {
      console.error(`Unable to get blogs: ${e}`);
      return { error: e };
    }
  }

  static async getPublishedBlogs(){
    try{
      const cursor = await contents.find({status: "published"});
      return cursor.toArray();
    } catch(e){
      console.error(`Unable to get published pages: ${e}`);
      return {error: e};
    }
  }

  static async getPageBySlug(slug){
    try{
      return await contents.findOne({
        url: slug,
        status: "published"
      });
    } catch(e){
      console.error(`Unable to get page data: ${e}`);
      return { error: e };
    }
  }

  static async deletePage(pageId) {
    try {
      const deleteResponse = await contents.deleteOne({
        _id: new ObjectId(pageId),
      });
      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete page: ${e}`);
      return { error: e };
    }
  }

  static async getPageData(pageId) {
    try {
      return await contents.findOne({ _id: new ObjectId(pageId) });
    } catch (e) {
      console.error(`Unable to get page data: ${e}`);
      return { error: e };
    }
  }

  static async updatePage(
    pageId,
    title,
    subText,
    contentBody,
    url,
    author,
    showAUthor,
    publishDate,
    publishTime,
    modifiedAt,
    modifiedBy,
  ) {
    try {
      const updateResponse = await contents.updateOne(
        { _id: new ObjectId(pageId) },
        {
          $set: {
            title: title,
            subText: subText,
            contentBody: contentBody,
            url: url,
            author: author,
            showAUthor: showAUthor,
            publishDate: publishDate,
            publishTime: publishTime,
            modifiedAt: modifiedAt,
            modifiedBy: modifiedBy,
          },
        }
      );

      return updateResponse;
    } catch (e) {
      console.error(`Unable to update page: ${e}`);
      return { error: e };
    }
  }
}
