import { createConnection } from "net";

import { StructBuilder, Types } from "../src/";

const enum State {
    HANDSHAKE = 0,
    STATUS = 1,
    LOGIN = 2,
}

const Handshake = StructBuilder.new()
    .rowVarInt32("protocol_version")
    .rowPString("server_address", Types.UInt8)
    .rowUInt16("server_port")
    .rowVarInt32("next_status")
    .build<{
        protocol_version: number;
        server_address: string;
        server_port: number;
        next_status: State;
    }>();

const StatusRequest = StructBuilder.new().build<{}>();
const StatusResponse = StructBuilder.new().rowPString("json_response", Types.UInt16).build<{ json_response: string }>();

function createMcPacket(packet_id: number, data: Buffer): Buffer {
    let tempBuffer = Buffer.concat([Types.VarInt32.write(packet_id), data]);
    return Buffer.concat([Types.VarInt32.write(tempBuffer.length), tempBuffer]);
}

function readMcPacket(pack: Buffer): [{ id: number; data: Buffer }, number] {
    let offset = 0;
    let [length, length_offset] = Types.VarInt32.read(pack, 0);
    let [id, id_offset] = Types.VarInt32.read(pack, length_offset);
    offset = length_offset + id_offset;
    const data = pack.subarray(offset, offset + length);
    return [{ id, data }, offset + length];
}

const host = "mc.xasmc.xyz";
const port = 25565;
let state: State = State.HANDSHAKE;

const client = createConnection({ host, port }, () => {
    console.log("已连接到服务器");
    let tempBuffer = Buffer.alloc(0);
    // let offset = 0;
    client.on("data", (data) => {
        tempBuffer = Buffer.concat([tempBuffer, data]);
        while (true) {
            if (tempBuffer.length == 0) break;
            let [length, _] = Types.VarInt32.read(tempBuffer, 0);
            if (length > tempBuffer.length) break;

            let [{ id, data: pack_data }, pack_offset] = readMcPacket(tempBuffer);
            tempBuffer = tempBuffer.subarray(pack_offset);

            // 处理数据包
            if (state == State.HANDSHAKE) {
                // do something
            } else if (state == State.STATUS) {
                if (id == 0) {
                    // Status Response
                    const [pack_info, pack_length] = StatusResponse.read(pack_data, 0);
                    console.log({ state, id, pack_info, pack_length });
                }
            } else if (state == State.LOGIN) {
                // do something
            }
        }
    });

    // 握手 切换到 Status 状态
    client.write(
        createMcPacket(
            0,
            Handshake.write({
                protocol_version: 765,
                server_address: host,
                server_port: port,
                next_status: 1,
            }),
        ),
    );
    state = State.STATUS;
    // 发送状态请求包
    client.write(createMcPacket(0, StatusRequest.write({})));
});
