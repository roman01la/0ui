export const match = expr => obj => {
  if (obj.hasOwnProperty(expr)) {
    return obj[expr]();
  } else if (obj.hasOwnProperty("else")) {
    return obj["else"]();
  } else {
    throw new Error(`No matching clause for "${expr}"`);
  }
};

export const withStyles = props => styles => {
  const s = { ...styles };
  if (props.hasOwnProperty("my")) {
    s.marginTop = props.my * 4;
    s.marginBottom = props.my * 4;
  }
  if (props.hasOwnProperty("mx")) {
    s.marginLeft = props.mx * 4;
    s.marginRight = props.mx * 4;
  }
  return s;
};

export const withPreventDefault = fn => event => {
  event.preventDefault();
  return fn(event);
};
