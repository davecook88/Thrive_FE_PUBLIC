import React from "react";
interface Props {
  color?: string;
}
const NavIcon: React.FC<Props> = ({ color }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <g>
          <path d="M23.184.453H.774A.775.775 0 000 1.227v3.441c0 .426.348.773.773.773h22.41a.775.775 0 00.774-.773V1.227a.775.775 0 00-.773-.774zm0 0M23.184 9.484H.774a.775.775 0 00-.774.774v3.441c0 .426.348.774.773.774h22.41a.775.775 0 00.774-.774v-3.441a.775.775 0 00-.773-.774zm0 0M23.184 18.516H.774a.775.775 0 00-.774.773v3.441c0 .426.348.774.773.774h22.41a.775.775 0 00.774-.774v-3.44a.775.775 0 00-.773-.774zm0 0"></path>
        </g>
      </svg>
    </>
  );
};

export default NavIcon;
