import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
} from "@material-ui/core";
import { useContext, useState } from "react";
import { useTreasureContract } from "../hooks";
import { EthersContext } from "../contexts";

const Hint = () => {
  const { signer } = useContext(EthersContext);
  const { treasureContract } = useTreasureContract(signer);
  const onClickGetHint = async () => {
    const hintResult = await treasureContract?.getHintByTokenId(
      requestTokenIdForHint
    );
    console.log("hintResult", hintResult);
    setHint(hintResult);
  };

  const [hint, setHint] = useState<string>();
  const [requestTokenIdForHint, setRequestTokenIdForHint] = useState<number>(0);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequestTokenIdForHint(Number((event.target as HTMLInputElement).value));
  };
  return (
    <>
      <FormLabel id="demo-row-radio-buttons-group-label">TokenId</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={requestTokenIdForHint}
        onChange={handleChange}
      >
        {[0, 1, 2, 3, 4, 5].map((num) => (
          <FormControlLabel value={num} control={<Radio />} label={num} />
        ))}
      </RadioGroup>
      <Button onClick={onClickGetHint}>Get Hint</Button>
      <Typography>{hint ? hint : "there isn't hint"}</Typography>
    </>
  );
};

export default Hint;
