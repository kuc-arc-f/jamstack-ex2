//
import React from 'react'
import Link from 'next/link';
import Head from 'next/head';
import marked from  'marked'

import Layout from '../../components/layout'
import LibCommon from '../../libs/LibCommon'
//
export default function Page({ blog }) {
// console.log(blog)
  var content = marked(blog.content)
  return (
    <Layout>
    <Head><title key="title">{blog.title}</title></Head>            
    <div className="container">
      <Link href="/" >
        <a className="btn btn-outline-primary mt-2">Back</a>
      </Link>
      <hr className="mt-2 mb-2" />
      <div className="show_head_wrap">
          <i className="fas fa-home"></i> >
          {blog.title}
      </div>
      <hr /> 
      <h1>{blog.title}</h1>
      Date: {blog.created_at}<br />
      <hr />
      <div id="post_item" dangerouslySetInnerHTML={{__html: `${content}`}}></div>
      <hr />                 
    </div>
    <style>{`
      div#post_item > p > img{
        max-width : 100%;
        height : auto;
      }
      div#post_item > hr {
        height: 1px;
        background-color: #000;
        border: none;
      }
      .show_head_wrap{ font-size: 1.4rem; }
      `}</style>      
  </Layout>
  )
}
//
export const getStaticPaths = async () => {
  var content = "pages"
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
};
export const getStaticProps = async context => {
  const postId = context.params.id
  var content = "pages"
  var url = process.env.BASE_URL + `/api/get/findone?content=${content}&id=${postId}`
  const res = await fetch( url);
  var blog = await res.json();
  blog  =  LibCommon.convertItemDate(blog)
//console.log(blog)
  return {
    props: { 
      blog: blog
    },
  }
  
};


