import { createConnection, Socket } from "net";
import { StructBuilder, BaseTypes, write, Package, read } from "../src/";
import { format } from "util";

const enum State {
    HANDSHAKE = 0,
    STATUS = 1,
    LOGIN = 2,
}

namespace Packages {
    export const Handshake = StructBuilder.new()
        .rowVarInt32("protocol_version")
        .rowPString("server_address")(BaseTypes.VarInt32)
        .rowUInt16("server_port")
        .rowVarInt32("next_status")
        .build<{
            protocol_version: number;
            server_address: string;
            server_port: number;
            next_status: State;
        }>()
        .toPackage();

    export const StatusRequest = StructBuilder.new().build<{}>().toPackage();

    export const StatusResponse = StructBuilder.new()
        .rowPString("json_response")(BaseTypes.VarInt32)
        .build<{ json_response: string }>()
        .toPackage();
}

type casedPacket = { packetId: number; data: Buffer };

function createCasedPacketBuffer(packetId: number, data: Buffer): Buffer {
    const payloadBuffer = Buffer.concat([write(BaseTypes.VarInt32, packetId), data]);
    return Buffer.concat([write(BaseTypes.VarInt32, payloadBuffer.length), payloadBuffer]);
}

function readCasedPacket(buffer: Buffer): [casedPacket | undefined, number] {
    if (buffer.length === 0) return [undefined, 0];
    const [length, lengthOffset] = read(BaseTypes.VarInt32, buffer, 0);
    if (length > buffer.length) {
        return [undefined, 0];
    }
    const [packetId, idOffset] = read(BaseTypes.VarInt32, buffer, lengthOffset);
    const offset = lengthOffset + idOffset;
    const data = buffer.subarray(offset, offset + length);
    return [{ packetId, data }, offset + length];
}

function sendMcPacket(client: Socket, packetId: number, packet: Package<any>) {
    client.write(createCasedPacketBuffer(packetId, packet.buffer));
}

const host = "2b2t.xin";
const port = 25565;
let state: State = State.HANDSHAKE;

const client = createConnection({ host, port }, () => {
    console.log("已连接到服务器");

    let tempBuffer = Buffer.alloc(0);

    client.on("data", (data) => {
        console.log("awa");
        console.log(data);
        tempBuffer = Buffer.concat([tempBuffer, data]);

        while (true) {
            const [casedPacket, casedPacketOffset] = readCasedPacket(tempBuffer);
            if (!casedPacket) break;

            tempBuffer = tempBuffer.subarray(casedPacketOffset);

            // 处理数据包
            const { packetId, data: packetData } = casedPacket;
            if (state == State.HANDSHAKE) {
                // handshaking
                // do something
            } else if (state == State.STATUS) {
                // queuing server status
                if (packetId == 0) {
                    const pack = Packages.StatusResponse.fromBuffer(packetData, 0);
                    console.log(pack);
                }
            } else if (state == State.LOGIN) {
                // logging in
                // do something
            }
        }
    });

    client.on("error", (err) => {
        console.log(err);
    });

    client.on("end", () => {
        console.log("end");
    });

    // 握手 切换到 Status 状态
    sendMcPacket(
        client,
        0,
        Packages.Handshake.formData({
            protocol_version: 765,
            server_address: host,
            server_port: port,
            next_status: State.STATUS,
        }),
    );
    state = State.STATUS;

    // 请求服务器状态
    sendMcPacket(client, 0, Packages.StatusRequest.formData({}));
});
