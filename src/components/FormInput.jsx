const FormInput = (props) => {
    return (
      <div className="FormInput">
          <input 
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            required />
      </div>
    )
  }
  
  export default FormInput