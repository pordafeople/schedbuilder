import { SisData } from './parse'
import TextBox from './TextBox'

function Remarks({ sis_data, err }: { sis_data: SisData; err?: string }) {
  return err ? (
    <div className="error">
      <h1>WARNING</h1>
      <TextBox text={err} />
    </div>
  ) : (
    <div className="remarks">
      <TextBox
        text={
          `Found ${sis_data.classes.length} subjects/classes.\n` +
          `Please double check the input data.\n` +
          `\n` +
          `Here is a JSON dump of your whole SIS data if you want it:\n` +
          `\n` +
          `${JSON.stringify(sis_data, null, 2)}`
        }
      />
    </div>
  )
}

export default Remarks
