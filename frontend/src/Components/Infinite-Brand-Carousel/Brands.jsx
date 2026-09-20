import Marquee from "react-fast-marquee";
import './Brands.css'

//Brand Carousel Color - #f9fafb

export default function Brands() {
  return (
    <Marquee pauseOnHover={false} className='mb-4 mt-1 brands-div' style={{backgroundColor: 'white'}}>
      <div className='container p-3'><img src={`/Logo Images/gucci.png`} alt="gucci" width={300} height={100}/></div>
      <div className='container p-3'><img src={`/Logo Images/tory burch.png`} alt="tory burch" width={300} height={100}/></div>
      <div className='container p-3'><img src={`/Logo Images/Chanel.png`} alt="chanel" width={300} height={100}/></div>
      <div className='container p-3'><img src={`/Logo Images/Michael Kors.png`} alt="michael kors" width={300} height={100}/></div>
      <div className='container p-3'><img src={`/Logo Images/Coach.png`} alt="coach" width={300} height={100}/></div>         
    </Marquee>
  )
}
