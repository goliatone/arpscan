# arpscan

Simple [arp-scan][arp-scan] wrapper module.

>arp-scan sends ARP (Address Resolution Protocol) queries to the specified targets, and displays any responses that are received. It allows any part of the outgoing ARP packets to be changed, allowing the behavior of targets to non-standard ARP packets to be examined. The IP address and hardware address of received packets are displayed, together with the vendor details. These details are obtained from the IEEE OUI and IAB listings, plus a few manual entries. It includes arp-fingerprint, which allows a system to be fingerprinted based on how it responds to non-standard ARP packets.

[arp-scan]: http://linux.die.net/man/1/arp-scan

Tested in Mac OSX 10.9.5 and Raspbian GNU/Linux 7 (wheezy).

## Getting Started
First you need to install `arp-scan` if is not already installed.

On Debian:
```
sudo apt-get install arp-scan
```

In macOS it will use `arp`.

Install the module with: `npm install arpscan`

If you get this error when running this module, you might have to `sudo` the command:
>pcap_lookupdev: no suitable device found


## Documentation

```
Usage: arpscan [options]

Options:

  -h, --help                   output usage information
  -V, --version                output the version number
  -C, --check-arpscan          Test to see if arp-scan is installed
  -i, --interface [interface]  Interface to scan
  -v, --verbose                Verbose mode

```

To use the module from your program:

```javascript
const arpScanner = require('arpscan');

arpScanner(onResult, options);

function onResult(err, data){
    if(err) throw err;
    console.log(data);
}
```

To use the module from your program with promises:

```javascript
var arpScanner = require('arpscan/promise');

arpScanner(options)
    .then(onResult)
    .catch(onError);

function onResult(data) {
    console.log(data);
}

function onError(err) {
    throw err;
}
```
### Options

| Name          | Type     | Description                                          | Default       |
| ------------- | -------- | ---------------------------------------------------- | ------------- | 
| **command**   | String   | The command that's used to scan network via ARP.     | `'arp-scan'`  |
| **args**      | String[] | The args sent to the command.                        | `[ '-l' ]`    |
| **interface** | String   | The interface that sends the ARP packet.             | `'wlan0'`     |
| **parser**    | Function | A function called to parse the gathered data.        | `parse`       |
| **sudo**      | Boolean  | A flag indicating if the command is called via sudo. | `false`       |

The output should be something similar to:

```javascript
[ { ip: '192.168.1.1',
    mac: 'AC:CF:23:31:9B:FC',
    vendor: 'Cisco-Linksys, LLC',
    timestamp: 1427686747854 },
  { ip: '192.168.1.132',
    mac: 'AC:CF:23:3F:9B:33',
    vendor: 'Raspberry Pi Foundation',
    timestamp: 1427686747854 },
  { ip: '192.168.1.140',
    mac: 'b8:e9:37:11:d5:5c',
    vendor: 'Sonos, Inc.',
    timestamp: 1427686747854 },
  { ip: '192.168.1.143',
    mac: '00:19:93:68:65:53',
    vendor: 'Apple',
    timestamp: 1427686747854 },
  { ip: '192.168.1.148',
    mac: 'AC:FC:23:3F:9B:23',
    vendor: 'Hi-flying electronics technology Co.,Ltd (DUP: 2)',
    timestamp: 1427686747854 } ]
```

The module also provides a `cli` interface:
```
$ arpscan
```

### Errors

If `arpscan` fails, try to run the command manually:
```
$ arp-scan -l
```
You might get an error similar to this:

>WARNING: Could not obtain IP address for interface fw0. Using 0.0.0.0 for
the source address, which is probably not what you want.
Either configure fw0 with an IP address, or manually specify the address
with the --arpspa option.
Interface: fw0, datalink type: APPLE_IP_OVER_IEEE1394 (Apple IP-over-IEEE 1394)
WARNING: Unsupported datalink type
ERROR: Could not obtain interface IP address and netmask
ERROR: pcap_lookupnet: fw0: no IPv4 address assigned

You might want to specify which interface to use:
```
$ arp-scan -interface en0 --localnet
```

## TODO
- Parse signature metadata
- Handle `arp-scan` not available in machine!


>890 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.9: 256 hosts scanned in 1.861 seconds (137.56 hosts/sec). 7 responded

## Release History
- Version: 0.3.0 2016-11-11 Added interface option
- Version: 0.2.0 2016-11-10 Added Promise API
- Version: 0.0.2 2015-03-29
- Version: 0.0.1 2015-03-29

## License
Copyright (c) 2015 goliatone  
Licensed under the MIT license.



MAC os output:
```
Interface: en0, datalink type: EN10MB (Ethernet)
Starting arp-scan 1.9 with 256 hosts (http://www.nta-monitor.com/tools/arp-scan/)
192.168.1.1 48:f8:b3:1b:57:84   Cisco-Linksys, LLC
192.168.1.143   e8:8d:28:19:68:47   Apple (DUP: 1)
192.168.1.132   b8:27:eb:81:56:02   Raspberry Pi Foundation (DUP: 1)
192.168.1.140   b8:e9:37:11:d5:5c   Sonos, Inc. (DUP: 1)
192.168.1.125   f0:08:f1:5e:65:10   Samsung Electronics Co.,Ltd (DUP: 1)
192.168.1.132   b8:27:eb:81:56:02   Raspberry Pi Foundation (DUP: 2)
192.168.1.140   b8:e9:37:11:d5:5c   Sonos, Inc. (DUP: 2)

890 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.9: 256 hosts scanned in 1.861 seconds (137.56 hosts/sec). 7 responded
```

Raspberry Pi B output:
```
Interface: eth0, datalink type: EN10MB (Ethernet)
Starting arp-scan 1.8.1 with 256 hosts (http://www.nta-monitor.com/tools/arp-scan/)
192.168.1.125   f0:08:f1:5e:65:10   (Unknown)
192.168.1.140   b8:e9:37:11:d5:5c   (Unknown)
192.168.1.143   e8:8d:28:19:68:47   (Unknown)
192.168.1.145   78:31:c1:b8:05:12   (Unknown)
192.168.1.146   00:19:9d:68:65:52   VIZIO, Inc.
192.168.1.131   b8:e9:37:5c:0f:c0   (Unknown)
192.168.1.138   b8:e9:37:5c:10:36   (Unknown)
192.168.1.148   ac:cf:23:3f:9b:fc   (Unknown)
192.168.1.1 48:f8:b3:1b:57:84   (Unknown)
192.168.1.144   ac:cf:23:39:bb:c2   (Unknown)

11 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.8.1: 256 hosts scanned in 4.393 seconds (58.27 hosts/sec). 10 responded
```
