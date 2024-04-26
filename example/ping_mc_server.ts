import { createConnection, Socket } from "net";
import { StructBuilder, BaseTypes, Package, read, BufferStream } from "../dist";

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

    export const StatusRequest = StructBuilder.new().build().toPackage();

    export const StatusResponse = StructBuilder.new()
        .rowPString("json_response")(BaseTypes.VarInt32)
        .build<{ json_response: string }>()
        .toPackage();
}

type casedPacket = { packetId: number; data: Buffer };

function createCasedPacketBuffer(packetId: number, data: Buffer): Buffer {
    const payloadBS = new BufferStream();
    payloadBS.put(BaseTypes.VarInt32, packetId);
    payloadBS.write(data);

    const bs = new BufferStream();
    bs.put(BaseTypes.VarInt32, payloadBS.length);
    bs.write(payloadBS.buffer);

    return bs.buffer;
}

function readCasedPacket(bs: BufferStream): casedPacket | void {
    if (bs.length === 0) return;
    const [length, offset] = read(BaseTypes.VarInt32, bs.buffer, 0);
    if (length > bs.length) return;
    bs.read(offset);

    const payload = bs.read(length);
    const payloadBS = new BufferStream(payload);

    const packetId = payloadBS.get(BaseTypes.VarInt32);
    const data = payloadBS.read(payloadBS.length);
    return { packetId, data };
}

function sendMcPacket(client: Socket, packetId: number, packet: Package<any>) {
    client.write(createCasedPacketBuffer(packetId, packet.buffer));
}

const host = "mc.xasmc.xyz";
const port = 25565;
let state: State = State.HANDSHAKE;

const client = createConnection({ host, port }, () => {
    console.log("已连接到服务器");

    const bs = new BufferStream();

    client.on("data", (data) => {
        bs.write(data);
        while (true) {
            const casedPacket = readCasedPacket(bs);
            if (!casedPacket) break;

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
    sendMcPacket(client, 0, Packages.StatusRequest.formData());
});
