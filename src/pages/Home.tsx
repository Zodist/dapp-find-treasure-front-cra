import {
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Stack } from "@mui/material";
import { ContractEventPayload, formatEther } from "ethers";
import { useContext, useState, useEffect, useCallback } from "react";
import Map, { Coordinate } from "../components/Map";
import { EthersContext } from "../contexts";
import { useTreasureContract } from "../hooks";
import TreasureList from "../components/TreasureList";
import Hint from "../components/Hint";

type Metadata = {
  image: string;
  attributes: {
    name: string;
    value: string;
  };
};

export type TreasureInfo = Coordinate & {
  tokenId: number;
  metadata: Metadata;
};

const Home = () => {
  const { provider, signer, connectWallet } = useContext(EthersContext);
  const { treasureContract } = useTreasureContract(signer);

  const [address, setAddress] = useState<string>();
  const [balance, setBalance] = useState<string>();
  const [treasureTokenBalance, setTreasureTokenBalance] = useState<string>();
  const [treasureList, setTreasureList] = useState<TreasureInfo[]>();

  const getBalance = useCallback(async () => {
    if (signer) {
      const _balance = await provider?.getBalance(signer?.address);
      setBalance(formatEther(_balance || 0));
    }
  }, [provider, signer]);

  useEffect(() => {
    (async () => {
      if (signer) {
        getBalance();
        setAddress(
          signer?.address.slice(0, 2 + 4) +
            "..." +
            signer?.address.slice(
              signer?.address.length - 4,
              signer?.address.length - 0
            )
        );
      }
    })();
  }, [getBalance, provider, signer]);

  const onClickGetNFTInfo = useCallback(async () => {
    const RESOLUTION = 100000;
    const _treasureList: TreasureInfo[] = [];
    for (var i = 0; i < Number(treasureTokenBalance || "0"); i++) {
      const _tokenId = await treasureContract?.tokenOfOwnerByIndex(
        signer?.address,
        i
      );

      const uri = await treasureContract?.tokenURI(_tokenId);

      const metadataQuery = await fetch(uri);
      const metadata = await metadataQuery.json();

      const tokenCoordinate = await treasureContract?.getCoordinateByTokenId(
        _tokenId
      );

      const treasureInfo: TreasureInfo = {
        lat: Number(tokenCoordinate[0].toString()) / RESOLUTION,
        lng: Number(tokenCoordinate[1].toString()) / RESOLUTION,
        tokenId: _tokenId,
        metadata: metadata,
      };

      _treasureList.push(treasureInfo);

      console.log("uri", uri);
      console.log("metadata", metadata);
      console.log(`token:${_tokenId}`);
      console.log("result", tokenCoordinate);
      console.log("result", tokenCoordinate[0].toString());
      console.log("result", tokenCoordinate[1].toString());
      console.log("result", tokenCoordinate.names);
    }
    setTreasureList(_treasureList);
  }, [signer?.address, treasureContract, treasureTokenBalance]);

  useEffect(() => {
    (async () => {
      console.log("name:", await treasureContract?.name());
      const _treasureTokenBalance: BigInt = await treasureContract?.balanceOf(
        signer?.address
      );
      setTreasureTokenBalance(_treasureTokenBalance?.toString());
    })();
    treasureContract?.on(
      "Transfer",
      (from, to, amount, event: ContractEventPayload) => {
        console.log("BigInt", BigInt(event.log.topics[3]));
        console.log("onTransfer", from, to, amount, event);
        if (from === "0x0000000000000000000000000000000000000000") {
          //code here
          getBalance();
          onClickGetNFTInfo();
        }
      }
    );
  }, [getBalance, onClickGetNFTInfo, signer?.address, treasureContract]);

  const onClickMint = async () => {
    if ("geolocation" in navigator) {
      /* 위치정보 사용 가능 */
      navigator.geolocation.getCurrentPosition(async (position) => {
        console.log(position.coords.latitude, position.coords.longitude);
        const resolution = 100000;
        // 위도
        const lat = (position.coords.latitude * resolution).toFixed();
        // 경도
        const lng = (position.coords.longitude * resolution).toFixed();
        const coordinate = { lat, lng };
        console.log(`lat:${lat},lng:${lng}`);

        try {
          const mintResult = await treasureContract?.mintTreasure(coordinate);
          console.log("mintResult", mintResult);
          console.log("hash", mintResult.hash);
          checkTx(mintResult.hash);
        } catch (error) {
          alert("이미 찾아진 쪽지입니다 ㅠ");
          console.error(error);
        }
      });
    } else {
      /* 위치정보 사용 불가능 */
    }
  };

  const checkTx = useCallback(
    async (txHash: string) => {
      const receipt = await provider?.getTransactionReceipt(txHash);
      console.log("receipt", receipt);
    },
    [provider]
  );

  const [centerToMove, setCenterToMove] = useState<Coordinate | null>();

  const onClickTreasureInfo = async (coordinate: Coordinate) => {
    setCenterToMove(coordinate);
  };

  const onCenterChanged = () => {
    setCenterToMove(null);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      {signer ? (
        <>
          <Stack alignItems="flex-start">
            <Typography variant="body1">address:{address}</Typography>
            <Typography variant="body1">eth:{balance}</Typography>
            <Typography variant="body1">
              Treasure:{treasureTokenBalance}
            </Typography>
            <TreasureList
              treasureList={treasureList}
              onClickTreasureInfo={onClickTreasureInfo}
            />
          </Stack>
          <Button onClick={onClickGetNFTInfo}>Get Info</Button>
          <Map
            treasures={treasureList}
            centerToMove={centerToMove}
            onCenterChanged={onCenterChanged}
          />
          <Button onClick={onClickMint}>Mint</Button>
          <div>
            <Button variant="outlined" onClick={handleClickOpen}>
              Get Hint
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Hints</DialogTitle>
              <DialogContent>
                <Hint />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Close</Button>
              </DialogActions>
            </Dialog>
          </div>
        </>
      ) : (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      )}
    </Stack>
  );
};

export default Home;
