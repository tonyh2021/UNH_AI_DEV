import {
  Dimensions,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';

type NamedStyles<T> = {[P in keyof T]: ViewStyle | TextStyle | ImageStyle};

const DESIGN_WIDTH = 375;
const {width} = Dimensions.get('window');

export const scale = (size: number) => {
  return (size * width) / DESIGN_WIDTH;
};

const createScaledStyle: <T extends NamedStyles<T> | NamedStyles<any>>(
  style: NamedStyles<T> | T,
) => T = style => {
  let s = {...style};
  // 目前仅对以下的属性进行处理
  let list = [
    'borderBottomWidth',
    'borderEndWidth',
    'borderLeftWidth',
    'borderRightWidth',
    'borderStartWidth',
    'borderTopWidth',
    'borderWidth',
    'borderRadius',
    'borderBottomEndRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'borderBottomStartRadius',
    'borderTopEndRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderTopStartRadius',
    'columnGap',
    'end',
    'gap',
    'rowGap',
    'start',

    'width',
    'height',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',

    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'marginHorizontal',
    'marginVertical',
    'marginEnd',
    'marginStart',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'paddingHorizontal',
    'paddingVertical',
    'paddingEnd',
    'paddingStart',

    'top',
    'right',
    'bottom',
    'left',

    'fontSize',
    'lineHeight',
  ];
  for (let outKey in s) {
    for (let innerKey in s[outKey]) {
      if (list.includes(innerKey) && typeof s[outKey][innerKey] === 'number') {
        // @ts-ignore 这里类型判断先忽略吧
        s[outKey][innerKey] = scale(s[outKey][innerKey]);
      }
    }
  }
  return StyleSheet.create(s);
};

export default createScaledStyle;
