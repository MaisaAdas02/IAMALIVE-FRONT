const Loading = ({ size = 40, color = "white" }) => {
     return (
          <div
               className="loading-spinner"
               style={{
                    "--size": `${size}px`,
                    "--loading-clr": color,
               }}
          />
     );
};

export default Loading;
