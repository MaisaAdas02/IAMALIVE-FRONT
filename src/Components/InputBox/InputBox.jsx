export default function InputBox({
    input: { icon: Icon, name, placeholder, type, value },
    handleChange,
    ...rest
}) {
    return (
         <div className="inputDiv" key={name}>
              <div className="input flex">
                   <Icon className="icon" />
                   <input
                        type={type}
                        name={name}
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        {...rest}
                   />
              </div>
         </div>
    );
}