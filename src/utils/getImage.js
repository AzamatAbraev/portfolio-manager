export const getImage = ({_id, name}) => {
  return `https://ap-portfolio-backend.up.railway.app/upload/${_id}.${name?.split(".")[1]}`;
}