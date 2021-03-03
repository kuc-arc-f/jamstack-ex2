import React from 'react'
//import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import Layout from '../../components/layout'
import IndexRow from './IndexRow';
import LibCommon from '../../libs/LibCommon'
import LibCms from '../../libs/LibCms'
//
function Page(data) {
  var items = data.blogs
//  var paginateDisp = data.display
//  var page = data.page
  var category_name = data.category_name
//console.log("display=", data.display)  
  return (
    <Layout>
      <Head><title key="title">{category_name} | {data.site_name}</title>
      </Head> 
      <div className="body_main_wrap">
        <div className="container">
          <Link href="/" >
            <a className="btn btn-outline-primary mt-2">Back</a>
          </Link>          
          <div className="body_wrap">
            <div id="post_items_box" className="row conte mt-2 mb-4">
              <div className="col-sm-12">
                <div id="div_news">
                  <h2 className="h4_td_title mt-2 mb-2">Category : {category_name}
                  </h2>
                </div>
                <hr />
              </div>
              {items.map((item, index) => {
//                console.log(item.id ,item.createdAt )
                return (<IndexRow key={index}
                  id={item.id} title={item.title}
                  date={item.created_at} />       
                )
              })}
            </div>
            <br /><br />
          </div>          
        </div>
      </div>
    </Layout>
    )  
}
//
export const getStaticProps = async context => {
  const id = context.params.id;
//console.log("id=", id )
  var content = "posts"
  var site_id = process.env.MY_SITE_ID
  var url_category = process.env.BASE_URL + `/api/get/findone?content=${content}&id=${id}`
  const resCategory = await fetch(url_category)
  var jsonCategory = await resCategory.json();
  var category_name = jsonCategory.name
//console.log(category_name)
  var url = process.env.BASE_URL + `/api/get/find?content=${content}&site_id=${site_id}`
  const res = await fetch(url);
  var blogs = await res.json();
  blogs = LibCommon.convert_items(blogs)
  blogs = LibCms.get_category_items(blogs, id)
// console.log(blogs)
  return {
    props : {
      blogs: blogs, display: 0, 
      site_name : process.env.MY_SITE_NAME,
      category_name: category_name,
    }
  };
}
//
export async function getStaticPaths() {
  var content = "category"
  var site_id = process.env.MY_SITE_ID  
  const res = await fetch(
    process.env.BASE_URL + `/api/get/find?content=${content}&site_id=${site_id}`
  );
  const repos = await res.json();
  var paths = []
  repos.map((item, index) => {
    var row = { params: 
      { id: item.id } 
    }
    paths.push(row)
  })
// console.log(paths)
  return {
    paths: paths,
    fallback: false
  }
}

export default Page
