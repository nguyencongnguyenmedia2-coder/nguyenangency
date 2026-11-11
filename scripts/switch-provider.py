p = r"d:\Nguyen wb\prisma\schema.prisma"
b = open(p, "rb").read()
b = b.replace(b'provider = "sqlite"', b'provider = "postgresql"', 1)
open(p, "wb").write(b)
print("ok", b[:12])

