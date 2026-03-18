import style from './BabyinterstingThings.module.css'

function BabyThing () {
  return(
    <div  className={style.bannel}>
    <div className={style.nav}>
      <h1 className={style.title}>宝&nbsp;&nbsp;贝&nbsp;&nbsp;趣&nbsp;&nbsp;事</h1>
      <span className={`iconfont icon-cha ${style.out}`}></span>
    </div>
    </div>
  )
}
export default BabyThing;