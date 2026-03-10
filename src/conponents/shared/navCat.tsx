import logoCat from '../../assets/img/logo.svg'
  
  export function NavCat() {
    return(
      <div className="navCat" style={{backgroundColor:'var(--theme-color)',
                                      width:'100%',
                                      height:'10vh'}}>
        <img src={logoCat} alt="logo" style={{width:'10vh',
                                              height:'10vh',
                                              position:'relative',
                                              left:'10%',
                                             bottom:'-6%',
                                            }}/>
        </div>
    )
  }
