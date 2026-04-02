// 数据
export type selectdatatype = {
  label:string,
  value:number
} 

  export   const coatColorOptions:selectdatatype[]  = [
      {'label':'橘猫/橘白猫','value':1},
      {'label':'玳瑁/三花','value':2},
      {'label':'纯色','value':3},
      {'label':'奶牛','value':4},
      {'label':'狸花/狸白','value':5},
      {'label':'雀猫','value':6},
      {'label':'其他','value':7},
    ]

   export  const staterOptions:selectdatatype[]  = [
      {'label':'待领养','value':1},
      {'label':'已被领养','value':2},
      {'label':'在家','value':3},
      {'label':'失踪','value':4},
      {'label':'去了喵星','value':5},
    ]

    export const neuteredStatusOptios:selectdatatype[] = [
      {'label':'未知','value': 0},
      {'label':'已绝育','value': 1},
      {'label':'未绝育','value': 2},
    ]
    export const genderOptios:selectdatatype[] = [
      {'label':'妹妹','value': 0},
      {'label':'弟弟','value': 1},
    ]