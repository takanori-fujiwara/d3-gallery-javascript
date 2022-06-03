const genUid = () => {
  let count = 0;

  return name => {
    const name_ = name == null ? '' : name;
    const id = `O-${name}-${count}`;
    const href = new URL(`#${id}`, location);
    count++;

    return {
      id: id,
      href: href
    }
  }
}

export const uid = genUid();