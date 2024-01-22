import React from 'react';
import FormInput from './FormInput';
import { Modal } from 'react-bootstrap';
export const Home = () => {

  const [jsonSchemaInput, setJsonSchemaInput] = React.useState("");
  const [UISchema, setUISchema] = React.useState([]);
  const [formData, setFormData] = React.useState({});
  const formDataMemo = {}
  const formRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  console.log(formData);

  const createFormData = (e) => {
    e.preventDefault();
    setOpen(true);
  }

  const handleCompile = () => {
    // compile json file or json schema
    try {
      const UISchemaRaw = JSON.parse(jsonSchemaInput);
      setUISchema(UISchemaRaw.sort((a, b) => a.sort - b.sort))
    } catch (e) {
      alert('Invalid JSON Schema');
    }
  }

  return (
    <div className='p-2 d-flex justify-content-between'>
      <div className="left w-50">
        {/* make json editor from scratch with styles  */}
        <div className="json-editor">
          <textarea className="form-control" placeholder='Paste the Form UI Schema...' rows="24"
            onChange={(e) => setJsonSchemaInput(e.target.value)}
            value={jsonSchemaInput}
          >
          </textarea>
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-success me-2" onClick={handleCompile}>Compile</button>
          <button onClick={() => setJsonSchemaInput("")} className="btn btn-danger">Clear</button>
        </div>
      </div>

      <div className="right p-3 w-50 ms-2 rounded" style={{
        border: '1px solid #ccc',
        height: '90vh',
        overflow: 'auto'
      }}>
        <form ref={formRef} onSubmit={createFormData} action="">
          {
            UISchema?.map((item, index) => {
              return <div key={index} className='border mb-3 p-3 bg-light rounded'>
                <FormInput
                  ancestorsJsonKeys={[]}
                  formData={formData}
                  setFormData={setFormData}
                  formDataMemo={formDataMemo}
                  item={item} key={index} />
              </div>
            })
          }
          {
            UISchema?.length === 0 ? <div className="text-center">
              <h6>No Form Schema Found</h6>
            </div> :
              <div className="text-center">
                <button className="btn btn-primary">Submit</button>
              </div>
          }


        </form>
      </div>
      <Modal show={open} onHide={() => setOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>FormData Output</Modal.Title>
        </Modal.Header>
        <Modal.Body>{
          <pre>{JSON.stringify(formData, '\n', 2)}</pre>
        }</Modal.Body>
      </Modal>
    </div>
  );
};

