import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemButton,
  IconButton,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Coordinate } from "./Map";
import { TreasureInfo } from "../pages";

const TreasureList = ({
  treasureList,
  onClickTreasureInfo,
}: {
  treasureList?: TreasureInfo[];
  onClickTreasureInfo: (coordinate: Coordinate) => void;
}) => {
  return (
    <List
      dense
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
    >
      {treasureList?.map((treasure) => {
        const name = treasure.metadata.attributes.name;
        const labelId = `checkbox-list-secondary-label-${name}`;
        return (
          <ListItem
            key={treasure.tokenId}
            secondaryAction={
              <IconButton onClick={() => onClickTreasureInfo(treasure)}>
                <MyLocationIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${treasure.lat + 1}`}
                  src={treasure.metadata.image}
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`${name}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default TreasureList;
