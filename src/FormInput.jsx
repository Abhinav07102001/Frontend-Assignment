import React, { useCallback, useEffect } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

export default function FormInput({ ancestorsJsonKeys, item, formData, setFormData, isParentIgnore, formDataMemo }) {

    const [radioValue, setRadioValue] = React.useState(item?.uiType === 'Radio' ? item?.validate?.defaultValue : null)
    const [checked, setChecked] = React.useState(item?.uiType === 'Switch' ? item?.validate?.defaultValue : false)

    const updateNestedObject = useCallback((obj, value) => {
        let ancestors = [...ancestorsJsonKeys]
        let currentObject = obj;
        for (let i = 0; i < ancestors.length; i++) {
            const ancestor = ancestors[i];
            if (!currentObject[ancestor]) {
                currentObject[ancestor] = {};
            }
            currentObject = currentObject[ancestor];
        }
        if (item.uiType === 'Radio') {
            currentObject['radioKey'] = item.jsonKey
            currentObject[item.jsonKey] = value;
        }
        else if (item.uiType !== 'Ignore')
            currentObject[item.jsonKey] = value;

        if (isParentIgnore) {
            currentObject = obj;
            for (let i = 0; i < ancestors.length - 1; i++) {
                const ancestor = ancestors[i];
                if (!currentObject[ancestor]) {
                    currentObject[ancestor] = {};
                }
                currentObject = currentObject[ancestor];
            }
            let copy = { ...currentObject }

            // delete keys from currentObject other than radioKey
            for (const key in currentObject) {
                if (key !== 'radioKey' && key !== copy.radioKey && key !== copy[copy.radioKey]) {
                    delete currentObject[key]
                }
            }
        }

    }, [ancestorsJsonKeys, isParentIgnore, item.jsonKey, item.uiType])


    const formatData = useCallback((value) => {
        if (item.uiType === 'Group') {
            return
        }
        setFormData((prev) => {
            let obj = { ...prev }
            updateNestedObject(obj, value)
            return obj
        })
        if (item.uiType === 'Radio') {
            setRadioValue(value)
        }

    }, [item.uiType, setFormData, updateNestedObject])


    useEffect(() => {
        if (item?.uiType !== 'Group') {
            formatData(item?.validate?.defaultValue)
        }
    }, [item?.uiType, item?.validate?.defaultValue])


    if (item?.disable) return null

    switch (item.uiType) {
        case 'Input':
            return (
                <div className="mb-3">
                    <label htmlFor={item.jsonKey}>{item.label} {item.validate.required && <span className="text-danger">*</span>}
                        {item.description && item.description !== "" &&
                            <OverlayTrigger placement="right" overlay={<Tooltip id={item.jsonKey}>{item.description}</Tooltip>}>
                                <i> &#x1F6C8; </i>
                            </OverlayTrigger>
                        }
                    </label>
                    {
                        item.level === 0 && <hr />
                    }
                    <input
                        onChange={(e) => formatData(e.target.value)}
                        type='text'
                        required={item?.validate.required}
                        immutable={item?.validate.immutable.toString()}
                        name={item.jsonKey}
                        className="form-control"
                        placeholder={item.placeholder} />
                </div>
            )

        case 'Select':
            return (
                <div className="mb-3">
                    <label htmlFor="">{item.label} {item.validate.required && <span className="text-danger">*</span>}
                        {item.description && item.description !== "" &&
                            <OverlayTrigger placement="right" overlay={<Tooltip id={item.jsonKey}>{item.description}</Tooltip>}>
                                <i> &#x1F6C8; </i>
                            </OverlayTrigger>
                        }
                    </label>
                    {
                        item.level === 0 && <hr />
                    }
                    <select name={item.jsonKey} className="form-control"
                        onChange={(e) => formatData(e.target.value)}
                    >
                        {
                            item.validate.options.map((option, index) => (
                                <option key={index} value={option.value}>{option.label}</option>
                            ))
                        }
                    </select>
                </div>
            )

        case 'Number':
            return (
                <div className="mb-3">
                    <label htmlFor="">{item.label} {item.validate.required && <span className="text-danger">*</span>}
                        {item.description && item.description !== "" &&
                            <OverlayTrigger placement="right" overlay={<Tooltip id={item.jsonKey}>{item.description}</Tooltip>}>
                                <i> &#x1F6C8; </i>
                            </OverlayTrigger>
                        }
                    </label>
                    {
                        item.level === 0 && <hr />
                    }
                    <input
                        onChange={(e) => formatData(e.target.value)}
                        type='number'
                        required={item?.validate.required}
                        immutable={item?.validate.immutable.toString()}
                        name={item.jsonKey}
                        className="form-control"
                        placeholder={item.placeholder} />
                </div>
            )

        case 'Switch':
            return (
                <div className="mb-3">
                    <label htmlFor="">{item.label} {item.validate.required && <span className="text-danger">*</span>}
                        {item.description && item.description !== "" &&
                            <OverlayTrigger placement="right" overlay={<Tooltip id={item.jsonKey}>{item.description}</Tooltip>}>
                                <i> &#x1F6C8; </i>
                            </OverlayTrigger>
                        }
                    </label>
                    {
                        item.level === 0 && <hr />
                    }
                    <div className="form-check form-switch">
                        <input className="form-check-input" checked={checked} type="checkbox" id="flexSwitchCheckDefault"
                            readOnly={true}
                            onClick={() => {
                                setChecked(!checked)
                                formatData(!checked)
                            }}
                        />
                    </div>
                </div>
            )

        case 'Radio':
            return (
                <div className="mb-3">
                    {/* <label htmlFor="">{item.label} {item.validate.required && <span className="text-danger">*</span>}
                        {item.description && item.description !== "" &&
                            <OverlayTrigger placement="right" overlay={<Tooltip id={item.jsonKey}>{item.description}</Tooltip>}>
                                <i> &#x1F6C8; </i>
                            </OverlayTrigger>
                        }
                    </label> */}
                    <div className="row gap-2 m-0">
                        {
                            item.validate.options.map((option, index) => (
                                <div className="col p-0" key={index}
                                    style={{
                                        border: '1px solid #ccc',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        backgroundColor: radioValue === option.value ? '#ccc' : '#fff'
                                    }}
                                    onClick={() => {
                                        setRadioValue(option.value)
                                        formatData(option.value)

                                        // delete keys from currentObject other than radioKey
                                        let obj = { ...formData }
                                        let currentObject = obj;
                                        for (let i = 0; i < ancestorsJsonKeys.length; i++) {
                                            const ancestor = ancestorsJsonKeys[i];
                                            if (!currentObject[ancestor]) {
                                                currentObject[ancestor] = {};
                                            }
                                            currentObject = currentObject[ancestor];
                                        }
                                        let copy = { ...currentObject }

                                        // delete keys from currentObject other than radioKey
                                        for (const key in currentObject) {
                                            if (key !== 'radioKey' && key !== copy.radioKey && key !== copy[copy.radioKey]) {
                                                delete currentObject[key]
                                            }
                                        }
                                        setFormData(obj)
                                    }}
                                >
                                    <div className="py-2 text-center">
                                        {option.label}
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>
            )

        case 'Ignore':
            let jsonKeyArray = item.conditions[0].jsonKey.split('.')
            if (formData[jsonKeyArray[0]]?.[jsonKeyArray[1]] === item.conditions[0].value) {
                return <div>
                    {item.subParameters.map((option, index) => (
                        <FormInput
                            formDataMemo={formDataMemo}
                            isParentIgnore={true}
                            setFormData={setFormData} formData={formData}
                            ancestorsJsonKeys={[...ancestorsJsonKeys, item.jsonKey.toLowerCase()]} item={option} key={index} />
                    ))}
                </div>
            }
            else {
                return null
            }

        case 'Group':
            return (
                <div className="mb-3">
                    <label htmlFor="">{item.label} {item.validate.required && <span className="text-danger">*</span>}
                        {item.description && item.description !== "" &&
                            <OverlayTrigger placement="right" overlay={<Tooltip id={item.jsonKey}>{item.description}</Tooltip>}>
                                <i> &#x1F6C8; </i>
                            </OverlayTrigger>
                        }
                    </label>
                    {
                        item.level === 0 && <hr />
                    }
                    <div className="form-group">
                        {
                            item.subParameters.map((option, index) => (
                                <FormInput
                                    formDataMemo={formDataMemo}
                                    setFormData={setFormData} formData={formData}
                                    ancestorsJsonKeys={[...ancestorsJsonKeys, item.jsonKey]} item={option} key={index} />
                            ))
                        }
                    </div>
                </div>
            )

        default: return null
    }

}
