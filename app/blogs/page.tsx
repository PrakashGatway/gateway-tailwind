import BlogNew from "@/components/blognew";
import PageServices from "@/services/PageServices";



export default async function Page() {



  
    const res = await PageServices.getBlogData({
      page: 1,
      limit: 5,
    })

    

    console.log(res)

    return(
        <>
        <BlogNew blog = {res.data.blog} />
        </>
    )
    
}