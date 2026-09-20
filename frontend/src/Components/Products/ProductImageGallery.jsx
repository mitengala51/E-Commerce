import { useState } from 'react'
import './ProductImageGallery.css'

export default function ProductImageGallery({ product_images }) {

  if(product_images.length > 0){
     var [img, setImg] = useState(`/Products Images/${product_images[0]?.image_url?.[0]}.jpg`);
  }

  function HandleMouseEnter(x){
    setImg(x)
  }

  return (
    <>
      <div className='d-flex justify-content-center mb-2' id='image-container'>
        <img
          src={img}
          loading="lazy"
          className="img-fluid rounded-2 border-0 shadow-lg"
          alt="product_images"
        />
      </div>

      <div className="d-flex flex-row justify-content-center mt-3">
        {product_images[0]?.image_url.map((img) => {
          return (
            <img
              src={`/Products Images/${img}.jpg`}
              key={img}
              className="rounded mx-sm-2 ml-1 border border-dark-subtle border-2 d-block hover-img"
              alt="..."
              width={80}
              height={80}
              onMouseEnter={() => {
                HandleMouseEnter(`/Products Images/${img}.jpg`);
              }}
            />
          );
        })}
        {/* <img src={p_1} id='p_1' className="rounded mx-sm-2 ml-1 border border-dark-subtle border-2 d-block" alt="..." width={80} height={80} onMouseEnter={()=>{ HandleMouseEnter(p_1) }}/> */}
        {/* <img src={p_2} id='p_2' className="rounded mx-sm-2 mx-1 border border-dark-subtle border-2 d-block" alt="..." width={80} height={80} onMouseEnter={()=>{ HandleMouseEnter(p_2) }}/>
        <img src={p_3} id='p_3' className="rounded mx-sm-2 mx-1 border border-dark-subtle border-2 d-block" alt="..." width={80} height={80} onMouseEnter={()=>{ HandleMouseEnter(p_3) }}/>
        <img src={p_4} id='p_4' className="rounded mx-sm-2 mr-1 border border-dark-subtle border-2 d-block" alt="..." width={80} height={80} onMouseEnter={()=>{ HandleMouseEnter(p_4) }}/> */}
      </div>
    </>
  );
}
